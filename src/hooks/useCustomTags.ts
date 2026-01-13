import { useState, useCallback, useEffect } from 'react';
import type { CustomTag, CustomTagValue } from '../types/filters';
import { defaultCustomTags } from '../data/mock-data';

const STORAGE_KEY = 'hr-demo-custom-tags';

// Load custom tags from localStorage
function loadCustomTags(): CustomTag[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom tags from localStorage:', e);
  }
  return [];
}

// Save custom tags to localStorage
function saveCustomTags(tags: CustomTag[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch (e) {
    console.error('Failed to save custom tags to localStorage:', e);
  }
}

interface UseCustomTagsReturn {
  // All tags (default + custom)
  allTags: CustomTag[];
  // Just custom tags (user-created)
  customTags: CustomTag[];
  // CRUD operations
  createTag: (key: string, label: string, values: string[]) => boolean;
  updateTag: (key: string, updates: { label?: string; values?: string[] }) => boolean;
  deleteTag: (key: string) => boolean;
  // Helpers
  getTagByKey: (key: string) => CustomTag | undefined;
  isDefaultTag: (key: string) => boolean;
}

export function useCustomTags(): UseCustomTagsReturn {
  const [customTags, setCustomTags] = useState<CustomTag[]>(loadCustomTags);

  // Combine default and custom tags
  const allTags = [...defaultCustomTags, ...customTags];

  // Persist to localStorage whenever customTags change
  useEffect(() => {
    saveCustomTags(customTags);
  }, [customTags]);

  const getTagByKey = useCallback((key: string): CustomTag | undefined => {
    return allTags.find(t => t.key === key);
  }, [allTags]);

  const isDefaultTag = useCallback((key: string): boolean => {
    return defaultCustomTags.some(t => t.key === key);
  }, []);

  const createTag = useCallback((key: string, label: string, valuesInput: string[]): boolean => {
    // Normalize key (lowercase, replace spaces with underscores)
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
    
    // Check if key already exists
    if (allTags.some(t => t.key === normalizedKey)) {
      return false;
    }

    // Create values array
    const values: CustomTagValue[] = valuesInput
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .map(v => ({
        value: v.toLowerCase().replace(/\s+/g, '_'),
        label: v,
      }));

    if (values.length === 0) {
      return false;
    }

    const newTag: CustomTag = {
      key: normalizedKey,
      label: label.trim(),
      values,
      isDefault: false,
    };

    setCustomTags(prev => [...prev, newTag]);
    return true;
  }, [allTags]);

  const updateTag = useCallback((key: string, updates: { label?: string; values?: string[] }): boolean => {
    // Can't update default tags
    if (isDefaultTag(key)) {
      return false;
    }

    setCustomTags(prev => prev.map(tag => {
      if (tag.key !== key) return tag;

      const updated = { ...tag };
      
      if (updates.label !== undefined) {
        updated.label = updates.label.trim();
      }
      
      if (updates.values !== undefined) {
        updated.values = updates.values
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .map(v => ({
            value: v.toLowerCase().replace(/\s+/g, '_'),
            label: v,
          }));
      }

      return updated;
    }));

    return true;
  }, [isDefaultTag]);

  const deleteTag = useCallback((key: string): boolean => {
    // Can't delete default tags
    if (isDefaultTag(key)) {
      return false;
    }

    setCustomTags(prev => prev.filter(t => t.key !== key));
    return true;
  }, [isDefaultTag]);

  return {
    allTags,
    customTags,
    createTag,
    updateTag,
    deleteTag,
    getTagByKey,
    isDefaultTag,
  };
}

