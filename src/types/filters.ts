// Filter operators
export type FilterOperator = 
  | 'is' 
  | 'is_not' 
  | 'is_any_of' 
  | 'is_none_of'
  | 'before' 
  | 'after' 
  | 'between';

// Filter types available
export type FilterType = 
  | 'status' 
  | 'department'
  | 'cost_center'
  | 'location'
  | 'work_role'
  | 'manager'
  | 'employment_type'
  | 'start_date' 
  | 'end_date'
  | 'custom_tag';

// Date range for date filters
export interface DateRange {
  from: Date;
  to?: Date;
}

// Individual filter definition
export interface Filter {
  id: string;
  type: FilterType;
  operator: FilterOperator;
  value: string | string[] | DateRange;
  tagKey?: string; // Used when type is 'custom_tag' to specify which tag
}

// ==========================================
// Custom Tags
// ==========================================

// A value option within a custom tag
export interface CustomTagValue {
  value: string;
  label: string;
}

// A custom tag definition (key with possible values)
export interface CustomTag {
  key: string;           // Unique identifier, e.g., "project"
  label: string;         // Display name, e.g., "Project"
  values: CustomTagValue[];
  isDefault?: boolean;   // True for pre-defined tags, false for user-created
}

// Filter type metadata
export interface FilterTypeMeta {
  type: FilterType;
  label: string;
  icon: string;
  operators: FilterOperator[];
  valueType: 'single' | 'multi' | 'date';
}

// ==========================================
// HR Domain Types
// ==========================================

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
}

// Cost Center
export interface CostCenter {
  id: string;
  code: string;
  name: string;
  departmentId: string;
}

// Location
export interface Location {
  id: string;
  name: string;
  country: string;
}

// Work Role
export interface WorkRole {
  id: string;
  title: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
}

// Employment Type
export type EmploymentType = 'full_time' | 'part_time' | 'contractor';

// Employee
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  costCenter: CostCenter;
  location: Location;
  workRole: WorkRole;
  manager?: Employee;
  employmentType: EmploymentType;
  avatar?: string;
}

// Absence Type
export type AbsenceType = 'vacation';

// Absence Status
export type AbsenceStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Absence Request (main data entity)
export interface AbsenceRequest {
  id: string;
  identifier: string;
  employee: Employee;
  absenceType: AbsenceType;
  status: AbsenceStatus;
  startDate: Date;
  endDate: Date;
  daysRequested: number;
  reason?: string;
  approver?: Employee;
  createdAt: Date;
  updatedAt: Date;
  tags?: Record<string, string>; // Custom tags as key:value pairs, e.g., { project: "alpha", team: "frontend" }
}

// ==========================================
// Filter Options & Configuration
// ==========================================

// Filter option for dropdowns
export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

// Operator labels for display
export const operatorLabels: Record<FilterOperator, string> = {
  is: 'is',
  is_not: 'is not',
  is_any_of: 'is any of',
  is_none_of: 'is none of',
  before: 'is before',
  after: 'is after',
  between: 'is between',
};

// Filter type configuration
export const filterTypeConfig: Record<FilterType, FilterTypeMeta> = {
  status: {
    type: 'status',
    label: 'Status',
    icon: 'circle-dot',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  department: {
    type: 'department',
    label: 'Department',
    icon: 'building-2',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  cost_center: {
    type: 'cost_center',
    label: 'Cost Center',
    icon: 'wallet',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  location: {
    type: 'location',
    label: 'Location',
    icon: 'map-pin',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  work_role: {
    type: 'work_role',
    label: 'Work Role',
    icon: 'briefcase',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  manager: {
    type: 'manager',
    label: 'Manager',
    icon: 'user-check',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  employment_type: {
    type: 'employment_type',
    label: 'Employment Type',
    icon: 'badge',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
  start_date: {
    type: 'start_date',
    label: 'Start Date',
    icon: 'calendar',
    operators: ['before', 'after', 'between'],
    valueType: 'date',
  },
  end_date: {
    type: 'end_date',
    label: 'End Date',
    icon: 'calendar-check',
    operators: ['before', 'after', 'between'],
    valueType: 'date',
  },
  custom_tag: {
    type: 'custom_tag',
    label: 'Tags',
    icon: 'tag',
    operators: ['is', 'is_not', 'is_any_of', 'is_none_of'],
    valueType: 'multi',
  },
};

// Status options
export const statusOptions: FilterOption[] = [
  { value: 'pending', label: 'Pending', color: 'var(--color-status-pending)' },
  { value: 'approved', label: 'Approved', color: 'var(--color-status-approved)' },
  { value: 'rejected', label: 'Rejected', color: 'var(--color-status-rejected)' },
  { value: 'cancelled', label: 'Cancelled', color: 'var(--color-status-cancelled)' },
];

// Employment type options
export const employmentTypeOptions: FilterOption[] = [
  { value: 'full_time', label: 'Full-time', color: 'var(--color-employment-fulltime)' },
  { value: 'part_time', label: 'Part-time', color: 'var(--color-employment-parttime)' },
  { value: 'contractor', label: 'Contractor', color: 'var(--color-employment-contractor)' },
];
