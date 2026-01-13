import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TestUser, PermissionScope } from '../types/permissions';
import { testUsers, defaultUser } from '../types/permissions';

interface UserContextValue {
  currentUser: TestUser;
  setCurrentUser: (userId: string) => void;
  availableUsers: TestUser[];
  // Helper to check if a tag value is allowed in a scope
  isValueAllowedInScope: (scopeId: string, tag: string, value: string) => boolean;
  // Helper to get allowed values for a tag in a scope
  getAllowedValuesForTag: (scopeId: string, tag: string) => string[] | null;
  // Helper to check if a tag is restricted in a scope
  isTagRestrictedInScope: (scopeId: string, tag: string) => boolean;
  // Helper to check if a tag is locked (required) in a scope
  isTagLockedInScope: (scopeId: string, tag: string) => boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<TestUser>(defaultUser);

  const setCurrentUser = useCallback((userId: string) => {
    const user = testUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserState(user);
    }
  }, []);

  const getScopeById = useCallback((scopeId: string): PermissionScope | undefined => {
    return currentUser.scopes.find(s => s.id === scopeId);
  }, [currentUser]);

  const isTagLockedInScope = useCallback((scopeId: string, tag: string): boolean => {
    const scope = getScopeById(scopeId);
    if (!scope) return false;
    return scope.requiredFilters.some(f => f.tag === tag);
  }, [getScopeById]);

  const isTagRestrictedInScope = useCallback((scopeId: string, tag: string): boolean => {
    const scope = getScopeById(scopeId);
    if (!scope) return false;
    return scope.restrictedTags?.some(r => r.tag === tag) ?? false;
  }, [getScopeById]);

  const getAllowedValuesForTag = useCallback((scopeId: string, tag: string): string[] | null => {
    const scope = getScopeById(scopeId);
    if (!scope) return null;
    
    // Check if tag is locked (required filter)
    const lockedFilter = scope.requiredFilters.find(f => f.tag === tag);
    if (lockedFilter) {
      return [lockedFilter.value]; // Only one value allowed
    }
    
    // Check if tag is restricted
    const restriction = scope.restrictedTags?.find(r => r.tag === tag);
    if (restriction) {
      return restriction.allowedValues;
    }
    
    // Tag is not restricted - return null to indicate all values allowed
    return null;
  }, [getScopeById]);

  const isValueAllowedInScope = useCallback((scopeId: string, tag: string, value: string): boolean => {
    const allowedValues = getAllowedValuesForTag(scopeId, tag);
    
    // If null, all values are allowed
    if (allowedValues === null) return true;
    
    return allowedValues.includes(value);
  }, [getAllowedValuesForTag]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: testUsers,
        isValueAllowedInScope,
        getAllowedValuesForTag,
        isTagRestrictedInScope,
        isTagLockedInScope,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

