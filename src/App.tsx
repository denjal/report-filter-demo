import { useState } from 'react';
import { useScopeFilteredData } from './components/filters/ScopeFilterBar';
import { ScopeBranch } from './components/filters/ScopeBranch';
import { DataTable } from './components/table/DataTable';
import { UserSelector } from './components/UserSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { TagManagementModal } from './components/TagManagementModal';
import { useUser } from './context/UserContext';
import { absenceRequests } from './data/mock-data';
import { CalendarDays, X, Tag } from 'lucide-react';
import { Button } from './components/ui/Button';

function AppContent() {
  const { currentUser } = useUser();
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const {
    filteredData,
    getFiltersForScope,
    addFilterToScope,
    updateFilterInScope,
    removeFilterFromScope,
    clearScopeFilters,
    clearAllFilters,
    hasActiveFilters,
  } = useScopeFilteredData(absenceRequests);

  const hasMultipleScopes = currentUser.scopes.length > 1;

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="border-b border-border bg-surface-1">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Absence Manager</h1>
                <p className="text-sm text-text-tertiary">HR Time & Absence Reporting</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTagModalOpen(true)}
                className="gap-2"
              >
                <Tag className="h-4 w-4" />
                Manage Tags
              </Button>
              <ThemeToggle />
              <UserSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Permission info banner */}
        <div className="mb-4 p-3 rounded-lg bg-surface-1 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{currentUser.name}</span>
                {' · '}
                <span className="text-text-tertiary">{currentUser.role}</span>
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {currentUser.description}
                {' · '}
                {currentUser.scopes.length} access scope{currentUser.scopes.length !== 1 ? 's' : ''}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-text-tertiary hover:text-text-secondary"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Scope-based filter branches */}
        <div className="mb-6 space-y-3">
          {currentUser.scopes.map((scope, index) => (
            <div key={scope.id}>
              <ScopeBranch
                scope={scope}
                filters={getFiltersForScope(scope.id)}
                onAddFilter={(type, operator, value, tagKey) => 
                  addFilterToScope(scope.id, type, operator, value, tagKey)
                }
                onUpdateFilter={(filterId, updates) => 
                  updateFilterInScope(scope.id, filterId, updates)
                }
                onRemoveFilter={(filterId) => 
                  removeFilterFromScope(scope.id, filterId)
                }
                onClearFilters={() => clearScopeFilters(scope.id)}
                onManageTags={() => setTagModalOpen(true)}
              />
              
              {/* OR divider between scopes */}
              {hasMultipleScopes && index < currentUser.scopes.length - 1 && (
                <div className="flex items-center gap-4 my-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-2">
                    or
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-text-primary">Absence Requests</h2>
            <span className="text-sm text-text-tertiary">
              {filteredData.length} {filteredData.length === 1 ? 'request' : 'requests'}
              {(hasActiveFilters || currentUser.scopes.some(s => s.requiredFilters.length > 0)) && (
                <span className="ml-1">
                  (filtered from {absenceRequests.length})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Data table */}
        <DataTable data={filteredData} />
      </main>

      {/* Tag Management Modal */}
      <TagManagementModal
        open={tagModalOpen}
        onOpenChange={setTagModalOpen}
      />
    </div>
  );
}

export default AppContent;
