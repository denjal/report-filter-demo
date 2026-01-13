import { useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Lock, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { useCustomTags } from '../hooks/useCustomTags';
import { cn } from '../lib/cn';
import type { CustomTag } from '../types/filters';

interface TagManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManagementModal({ open, onOpenChange }: TagManagementModalProps) {
  const { allTags, createTag, updateTag, deleteTag, isDefaultTag } = useCustomTags();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagValues, setNewTagValues] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editValues, setEditValues] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateTag = () => {
    setError(null);
    
    if (!newTagName.trim()) {
      setError('Tag name is required');
      return;
    }
    
    if (!newTagValues.trim()) {
      setError('At least one value is required');
      return;
    }

    const values = newTagValues.split(',').map(v => v.trim()).filter(v => v);
    const success = createTag(newTagName, newTagName, values);
    
    if (!success) {
      setError('A tag with this name already exists');
      return;
    }

    setNewTagName('');
    setNewTagValues('');
  };

  const startEditing = (tag: CustomTag) => {
    setEditingTag(tag.key);
    setEditLabel(tag.label);
    setEditValues(tag.values.map(v => v.label).join(', '));
    setError(null);
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setEditLabel('');
    setEditValues('');
    setError(null);
  };

  const saveEditing = (key: string) => {
    setError(null);
    
    if (!editLabel.trim()) {
      setError('Tag name is required');
      return;
    }
    
    if (!editValues.trim()) {
      setError('At least one value is required');
      return;
    }

    const values = editValues.split(',').map(v => v.trim()).filter(v => v);
    updateTag(key, { label: editLabel, values });
    setEditingTag(null);
  };

  const handleDeleteTag = (key: string) => {
    deleteTag(key);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-accent" />
            Manage Tags
          </DialogTitle>
          <DialogDescription>
            Create and manage custom tags for filtering absence requests.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Existing Tags */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Existing Tags
            </h3>
            <div className="space-y-2">
              {allTags.map((tag) => (
                <div
                  key={tag.key}
                  className={cn(
                    'rounded-lg border border-border bg-surface-2/50 p-3',
                    editingTag === tag.key && 'ring-2 ring-accent'
                  )}
                >
                  {editingTag === tag.key ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-text-tertiary mb-1 block">
                          Tag Name
                        </label>
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-border bg-surface-1 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-tertiary mb-1 block">
                          Values (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editValues}
                          onChange={(e) => setEditValues(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-border bg-surface-1 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEditing(tag.key)}>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {tag.label}
                          </span>
                          {isDefaultTag(tag.key) && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-surface-3 text-text-tertiary">
                              <Lock className="h-3 w-3" />
                              Default
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-text-secondary">
                          {tag.values.map(v => v.label).join(', ')}
                        </div>
                        <div className="mt-1 text-xs text-text-tertiary">
                          Key: {tag.key} · {tag.values.length} values
                        </div>
                      </div>
                      {!isDefaultTag(tag.key) && (
                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEditing(tag)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDeleteTag(tag.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Create New Tag */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Create New Tag
            </h3>
            <div className="rounded-lg border border-border bg-surface-2/50 p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-text-tertiary mb-1 block">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., Region"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface-1 text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-tertiary mb-1 block">
                  Values (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTagValues}
                  onChange={(e) => setNewTagValues(e.target.value)}
                  placeholder="e.g., North, South, East, West"
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface-1 text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleCreateTag}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

