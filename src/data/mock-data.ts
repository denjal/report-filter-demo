import type { 
  Department, 
  CostCenter, 
  Location, 
  WorkRole, 
  Employee, 
  AbsenceRequest, 
  AbsenceStatus,
  EmploymentType,
  FilterOption 
} from '../types/filters';

// ==========================================
// Departments
// ==========================================
export const departments: Department[] = [
  { id: 'dept-1', name: 'Engineering', code: 'ENG' },
  { id: 'dept-2', name: 'Product', code: 'PRD' },
  { id: 'dept-3', name: 'Design', code: 'DSN' },
  { id: 'dept-4', name: 'Human Resources', code: 'HR' },
  { id: 'dept-5', name: 'Finance', code: 'FIN' },
  { id: 'dept-6', name: 'Sales', code: 'SLS' },
  { id: 'dept-7', name: 'Marketing', code: 'MKT' },
  { id: 'dept-8', name: 'Operations', code: 'OPS' },
];

// ==========================================
// Cost Centers
// ==========================================
export const costCenters: CostCenter[] = [
  { id: 'cc-1', code: 'CC-1000', name: 'Engineering - Platform', departmentId: 'dept-1' },
  { id: 'cc-2', code: 'CC-1001', name: 'Engineering - Backend', departmentId: 'dept-1' },
  { id: 'cc-3', code: 'CC-1002', name: 'Engineering - Frontend', departmentId: 'dept-1' },
  { id: 'cc-4', code: 'CC-2000', name: 'Product Management', departmentId: 'dept-2' },
  { id: 'cc-5', code: 'CC-3000', name: 'Design - UX', departmentId: 'dept-3' },
  { id: 'cc-6', code: 'CC-3001', name: 'Design - Visual', departmentId: 'dept-3' },
  { id: 'cc-7', code: 'CC-4000', name: 'Human Resources', departmentId: 'dept-4' },
  { id: 'cc-8', code: 'CC-5000', name: 'Finance & Accounting', departmentId: 'dept-5' },
  { id: 'cc-9', code: 'CC-6000', name: 'Sales - Enterprise', departmentId: 'dept-6' },
  { id: 'cc-10', code: 'CC-6001', name: 'Sales - SMB', departmentId: 'dept-6' },
  { id: 'cc-11', code: 'CC-7000', name: 'Marketing', departmentId: 'dept-7' },
  { id: 'cc-12', code: 'CC-8000', name: 'Operations', departmentId: 'dept-8' },
];

// ==========================================
// Locations
// ==========================================
export const locations: Location[] = [
  { id: 'loc-1', name: 'Stockholm', country: 'Sweden' },
  { id: 'loc-2', name: 'Gothenburg', country: 'Sweden' },
  { id: 'loc-3', name: 'Malmö', country: 'Sweden' },
  { id: 'loc-4', name: 'Remote', country: 'Sweden' },
];

// ==========================================
// Work Roles
// ==========================================
export const workRoles: WorkRole[] = [
  { id: 'role-1', title: 'Software Engineer', level: 'mid' },
  { id: 'role-2', title: 'Senior Software Engineer', level: 'senior' },
  { id: 'role-3', title: 'Staff Engineer', level: 'lead' },
  { id: 'role-4', title: 'Engineering Manager', level: 'manager' },
  { id: 'role-5', title: 'Product Manager', level: 'mid' },
  { id: 'role-6', title: 'Senior Product Manager', level: 'senior' },
  { id: 'role-7', title: 'UX Designer', level: 'mid' },
  { id: 'role-8', title: 'Senior UX Designer', level: 'senior' },
  { id: 'role-9', title: 'Design Lead', level: 'lead' },
  { id: 'role-10', title: 'HR Specialist', level: 'mid' },
  { id: 'role-11', title: 'HR Manager', level: 'manager' },
  { id: 'role-12', title: 'Financial Analyst', level: 'mid' },
  { id: 'role-13', title: 'Finance Manager', level: 'manager' },
  { id: 'role-14', title: 'Sales Representative', level: 'junior' },
  { id: 'role-15', title: 'Account Executive', level: 'mid' },
  { id: 'role-16', title: 'Sales Manager', level: 'manager' },
  { id: 'role-17', title: 'Marketing Specialist', level: 'mid' },
  { id: 'role-18', title: 'Marketing Manager', level: 'manager' },
  { id: 'role-19', title: 'Operations Coordinator', level: 'junior' },
  { id: 'role-20', title: 'Operations Manager', level: 'manager' },
  { id: 'role-21', title: 'Junior Software Engineer', level: 'junior' },
  { id: 'role-22', title: 'Product Director', level: 'director' },
];

// ==========================================
// Employees (including managers)
// ==========================================

// First, define managers without their manager field
const managersBase = [
  {
    id: 'emp-mgr-1',
    name: 'Anna Lindström',
    email: 'anna.lindstrom@company.se',
    department: departments[0],
    costCenter: costCenters[0],
    location: locations[0],
    workRole: workRoles[3], // Engineering Manager
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-2',
    name: 'Erik Johansson',
    email: 'erik.johansson@company.se',
    department: departments[1],
    costCenter: costCenters[3],
    location: locations[0],
    workRole: workRoles[21], // Product Director
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-3',
    name: 'Maria Svensson',
    email: 'maria.svensson@company.se',
    department: departments[2],
    costCenter: costCenters[4],
    location: locations[1],
    workRole: workRoles[8], // Design Lead
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-4',
    name: 'Johan Karlsson',
    email: 'johan.karlsson@company.se',
    department: departments[3],
    costCenter: costCenters[6],
    location: locations[0],
    workRole: workRoles[10], // HR Manager
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-5',
    name: 'Sofia Andersson',
    email: 'sofia.andersson@company.se',
    department: departments[4],
    costCenter: costCenters[7],
    location: locations[0],
    workRole: workRoles[12], // Finance Manager
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-6',
    name: 'Lars Nilsson',
    email: 'lars.nilsson@company.se',
    department: departments[5],
    costCenter: costCenters[8],
    location: locations[1],
    workRole: workRoles[15], // Sales Manager
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-7',
    name: 'Karin Pettersson',
    email: 'karin.pettersson@company.se',
    department: departments[6],
    costCenter: costCenters[10],
    location: locations[0],
    workRole: workRoles[17], // Marketing Manager
    employmentType: 'full_time' as EmploymentType,
  },
  {
    id: 'emp-mgr-8',
    name: 'Anders Eriksson',
    email: 'anders.eriksson@company.se',
    department: departments[7],
    costCenter: costCenters[11],
    location: locations[2],
    workRole: workRoles[19], // Operations Manager
    employmentType: 'full_time' as EmploymentType,
  },
];

// Create manager Employee objects (without manager field)
export const managers: Employee[] = managersBase.map(m => ({
  ...m,
  manager: undefined,
}));

// Regular employees with managers
const regularEmployeesData = [
  // Engineering
  { name: 'Oscar Bergman', email: 'oscar.bergman@company.se', dept: 0, cc: 1, loc: 0, role: 1, mgr: 0, emp: 'full_time' },
  { name: 'Elin Holm', email: 'elin.holm@company.se', dept: 0, cc: 2, loc: 0, role: 0, mgr: 0, emp: 'full_time' },
  { name: 'Viktor Lund', email: 'viktor.lund@company.se', dept: 0, cc: 1, loc: 3, role: 2, mgr: 0, emp: 'full_time' },
  { name: 'Maja Sandberg', email: 'maja.sandberg@company.se', dept: 0, cc: 2, loc: 1, role: 0, mgr: 0, emp: 'full_time' },
  { name: 'Filip Nyström', email: 'filip.nystrom@company.se', dept: 0, cc: 0, loc: 0, role: 20, mgr: 0, emp: 'full_time' },
  { name: 'Ida Wallin', email: 'ida.wallin@company.se', dept: 0, cc: 1, loc: 3, role: 1, mgr: 0, emp: 'part_time' },
  { name: 'Hugo Lindqvist', email: 'hugo.lindqvist@company.se', dept: 0, cc: 2, loc: 0, role: 0, mgr: 0, emp: 'contractor' },
  
  // Product
  { name: 'Wilma Olsson', email: 'wilma.olsson@company.se', dept: 1, cc: 3, loc: 0, role: 4, mgr: 1, emp: 'full_time' },
  { name: 'Axel Persson', email: 'axel.persson@company.se', dept: 1, cc: 3, loc: 0, role: 5, mgr: 1, emp: 'full_time' },
  { name: 'Ella Magnusson', email: 'ella.magnusson@company.se', dept: 1, cc: 3, loc: 3, role: 4, mgr: 1, emp: 'full_time' },
  
  // Design
  { name: 'Leo Gustafsson', email: 'leo.gustafsson@company.se', dept: 2, cc: 4, loc: 1, role: 6, mgr: 2, emp: 'full_time' },
  { name: 'Alma Jönsson', email: 'alma.jonsson@company.se', dept: 2, cc: 5, loc: 0, role: 7, mgr: 2, emp: 'full_time' },
  { name: 'Nils Larsson', email: 'nils.larsson@company.se', dept: 2, cc: 4, loc: 3, role: 6, mgr: 2, emp: 'contractor' },
  
  // HR
  { name: 'Saga Björk', email: 'saga.bjork@company.se', dept: 3, cc: 6, loc: 0, role: 9, mgr: 3, emp: 'full_time' },
  { name: 'Arvid Ek', email: 'arvid.ek@company.se', dept: 3, cc: 6, loc: 1, role: 9, mgr: 3, emp: 'part_time' },
  
  // Finance
  { name: 'Vera Strand', email: 'vera.strand@company.se', dept: 4, cc: 7, loc: 0, role: 11, mgr: 4, emp: 'full_time' },
  { name: 'Sigrid Hedlund', email: 'sigrid.hedlund@company.se', dept: 4, cc: 7, loc: 0, role: 11, mgr: 4, emp: 'full_time' },
  
  // Sales
  { name: 'Theo Berg', email: 'theo.berg@company.se', dept: 5, cc: 8, loc: 1, role: 14, mgr: 5, emp: 'full_time' },
  { name: 'Ebba Åberg', email: 'ebba.aberg@company.se', dept: 5, cc: 9, loc: 0, role: 13, mgr: 5, emp: 'full_time' },
  { name: 'Liam Dahl', email: 'liam.dahl@company.se', dept: 5, cc: 8, loc: 2, role: 14, mgr: 5, emp: 'full_time' },
  { name: 'Nova Forsberg', email: 'nova.forsberg@company.se', dept: 5, cc: 9, loc: 1, role: 13, mgr: 5, emp: 'contractor' },
  
  // Marketing
  { name: 'Elsa Nordin', email: 'elsa.nordin@company.se', dept: 6, cc: 10, loc: 0, role: 16, mgr: 6, emp: 'full_time' },
  { name: 'William Lindberg', email: 'william.lindberg@company.se', dept: 6, cc: 10, loc: 3, role: 16, mgr: 6, emp: 'full_time' },
  
  // Operations
  { name: 'Astrid Holmgren', email: 'astrid.holmgren@company.se', dept: 7, cc: 11, loc: 2, role: 18, mgr: 7, emp: 'full_time' },
  { name: 'Oliver Sjöberg', email: 'oliver.sjoberg@company.se', dept: 7, cc: 11, loc: 2, role: 18, mgr: 7, emp: 'part_time' },
];

export const employees: Employee[] = [
  ...managers,
  ...regularEmployeesData.map((emp, idx) => ({
    id: `emp-${idx + 9}`,
    name: emp.name,
    email: emp.email,
    department: departments[emp.dept],
    costCenter: costCenters[emp.cc],
    location: locations[emp.loc],
    workRole: workRoles[emp.role],
    manager: managers[emp.mgr],
    employmentType: emp.emp as EmploymentType,
  })),
];

// ==========================================
// Absence Requests
// ==========================================

// Helper functions
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getBusinessDays = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return Math.max(1, count);
};

// Status distribution weights
const statusWeights = {
  pending: 0.25,
  approved: 0.60,
  rejected: 0.10,
  cancelled: 0.05,
};

const getWeightedStatus = (): AbsenceStatus => {
  const random = Math.random();
  let cumulative = 0;
  for (const [status, weight] of Object.entries(statusWeights)) {
    cumulative += weight;
    if (random < cumulative) return status as AbsenceStatus;
  }
  return 'approved';
};

// Vacation reasons
const vacationReasons = [
  'Summer vacation',
  'Family trip',
  'Wedding',
  'Personal time off',
  'Holiday travel',
  'Visiting family',
  'Ski trip',
  'Long weekend',
  'Anniversary',
  'Moving to new apartment',
  'Home renovation',
  'Birthday celebration',
  undefined, // Some requests have no reason
  undefined,
  undefined,
];

// Generate absence requests
const generateAbsenceRequests = (): AbsenceRequest[] => {
  const requests: AbsenceRequest[] = [];
  let requestId = 1;
  
  // Generate 2-3 requests per employee
  employees.forEach((employee) => {
    const numRequests = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numRequests; i++) {
      const status = getWeightedStatus();
      
      // Determine date range based on status
      let startDate: Date;
      let endDate: Date;
      
      if (status === 'approved' || status === 'cancelled') {
        // Past or near future
        startDate = getRandomDate(new Date('2024-06-01'), new Date('2025-02-28'));
      } else if (status === 'pending') {
        // Future dates for pending
        startDate = getRandomDate(new Date('2025-01-20'), new Date('2025-06-30'));
      } else {
        // Rejected - could be any time
        startDate = getRandomDate(new Date('2024-09-01'), new Date('2025-03-31'));
      }
      
      // Duration: 1-14 days
      const duration = Math.floor(Math.random() * 14) + 1;
      endDate = addDays(startDate, duration - 1);
      
      const daysRequested = getBusinessDays(startDate, endDate);
      const createdAt = addDays(startDate, -Math.floor(Math.random() * 30) - 7);
      
      // Approver is typically the employee's manager
      const approver = status === 'approved' || status === 'rejected' 
        ? employee.manager 
        : undefined;
      
      requests.push({
        id: `abs-${requestId}`,
        identifier: `ABS-${String(requestId).padStart(3, '0')}`,
        employee,
        absenceType: 'vacation',
        status,
        startDate,
        endDate,
        daysRequested,
        reason: vacationReasons[Math.floor(Math.random() * vacationReasons.length)],
        approver,
        createdAt,
        updatedAt: status !== 'pending' ? addDays(createdAt, Math.floor(Math.random() * 5) + 1) : createdAt,
      });
      
      requestId++;
    }
  });
  
  // Sort by start date descending
  return requests.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};

export const absenceRequests = generateAbsenceRequests();

// ==========================================
// Filter Options (derived from data)
// ==========================================

export const departmentOptions: FilterOption[] = departments.map(dept => ({
  value: dept.id,
  label: dept.name,
  color: `var(--color-dept-${dept.name.toLowerCase().replace(/\s+/g, '')})`,
}));

export const costCenterOptions: FilterOption[] = costCenters.map(cc => ({
  value: cc.id,
  label: `${cc.code} - ${cc.name}`,
}));

export const locationOptions: FilterOption[] = locations.map(loc => ({
  value: loc.id,
  label: loc.name,
  color: `var(--color-loc-${loc.name.toLowerCase()})`,
}));

export const workRoleOptions: FilterOption[] = workRoles.map(role => ({
  value: role.id,
  label: role.title,
}));

export const managerOptions: FilterOption[] = managers.map(mgr => ({
  value: mgr.id,
  label: mgr.name,
}));

export const employeeOptions: FilterOption[] = employees.map(emp => ({
  value: emp.id,
  label: emp.name,
}));
