import type { FilterType } from './filters';

// A required filter that is locked (user cannot change)
export interface RequiredFilter {
  tag: FilterType;
  value: string; // Single value, locked to this
  label: string; // Display label
  tagKey?: string; // For custom_tag type, specifies which tag key
}

// A tag where user has limited options (not locked, but restricted to certain values)
export interface RestrictedTag {
  tag: FilterType;
  allowedValues: string[]; // User can only pick from these values
}

// A single permission scope (one "branch")
export interface PermissionScope {
  id: string;
  name: string; // Display name for the scope
  // Fixed tag values for this scope (user can't change these)
  requiredFilters: RequiredFilter[];
  // Tags where user has limited options (not locked, but restricted)
  restrictedTags?: RestrictedTag[];
}

// Test user with permission scopes
export interface TestUser {
  id: string;
  name: string;
  email: string;
  role: string;
  description: string;
  scopes: PermissionScope[];
}

// ==========================================
// Test Users with Different Permission Scopes
// ==========================================

export const testUsers: TestUser[] = [
  {
    id: 'user-admin',
    name: 'Anna Admin',
    email: 'anna.admin@company.se',
    role: 'Administrator',
    description: 'Full access to all data',
    scopes: [
      {
        id: 'scope-all',
        name: 'All Access',
        requiredFilters: [], // No locked filters
        restrictedTags: [], // No restrictions
      },
    ],
  },
  {
    id: 'user-manager',
    name: 'Marcus Manager',
    email: 'marcus.manager@company.se',
    role: 'HR + Engineering Lead',
    description: 'Access to HR (all locations) and Engineering (Stockholm only)',
    scopes: [
      {
        id: 'scope-engineering',
        name: 'Engineering Scope',
        requiredFilters: [
          { tag: 'department', value: 'dept-1', label: 'Engineering' },
          { tag: 'location', value: 'loc-1', label: 'Stockholm' },
        ],
        restrictedTags: [
          {
            tag: 'cost_center',
            allowedValues: ['cc-1', 'cc-2', 'cc-3'], // Platform, Backend, Frontend
          },
        ],
      },
      {
        id: 'scope-hr',
        name: 'HR Scope',
        requiredFilters: [
          { tag: 'department', value: 'dept-4', label: 'Human Resources' },
          { tag: 'custom_tag', value: 'alpha', label: 'Project Alpha', tagKey: 'project' },
        ],
        // No location restriction - can see all locations for HR
        restrictedTags: [
          {
            tag: 'cost_center',
            allowedValues: ['cc-7'], // HR cost center only
          },
        ],
      },
    ],
  },
  {
    id: 'user-regular',
    name: 'Rita Regular',
    email: 'rita.regular@company.se',
    role: 'Engineering Team Member',
    description: 'Access to Engineering department in Stockholm only',
    scopes: [
      {
        id: 'scope-eng-stockholm',
        name: 'Engineering Stockholm',
        requiredFilters: [
          { tag: 'department', value: 'dept-1', label: 'Engineering' },
          { tag: 'location', value: 'loc-1', label: 'Stockholm' },
        ],
        restrictedTags: [
          {
            tag: 'cost_center',
            allowedValues: ['cc-1', 'cc-2'], // Platform and Backend only
          },
        ],
      },
    ],
  },
];

// Default user (Admin)
export const defaultUser = testUsers[0];

