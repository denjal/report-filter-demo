import { createColumnHelper } from '@tanstack/react-table';
import { format, differenceInDays, isPast, isFuture } from 'date-fns';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Ban,
  MapPin,
  Building2,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import type { AbsenceRequest, AbsenceStatus, EmploymentType } from '../../types/filters';

const columnHelper = createColumnHelper<AbsenceRequest>();

// Status icon mapping
const statusIcons: Record<AbsenceStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  cancelled: <Ban className="h-4 w-4" />,
};

const statusColors: Record<AbsenceStatus, string> = {
  pending: 'text-status-pending',
  approved: 'text-status-approved',
  rejected: 'text-status-rejected',
  cancelled: 'text-status-cancelled',
};

const statusLabels: Record<AbsenceStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

// Employment type labels
const employmentTypeLabels: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contractor: 'Contractor',
};

const employmentTypeColors: Record<EmploymentType, string> = {
  full_time: 'var(--color-employment-fulltime)',
  part_time: 'var(--color-employment-parttime)',
  contractor: 'var(--color-employment-contractor)',
};

export const columns = [
  columnHelper.accessor('identifier', {
    header: 'ID',
    cell: (info) => (
      <span className="text-text-tertiary font-mono text-xs">
        {info.getValue()}
      </span>
    ),
    size: 90,
  }),

  columnHelper.accessor('employee', {
    header: 'Employee',
    cell: (info) => {
      const employee = info.getValue();
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent shrink-0">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <div className="text-text-primary font-medium truncate">
              {employee.name}
            </div>
            <div className="text-text-tertiary text-xs truncate">
              {employee.workRole.title}
            </div>
          </div>
        </div>
      );
    },
    size: 220,
  }),

  columnHelper.accessor('employee.department', {
    id: 'department',
    header: 'Department',
    cell: (info) => {
      const department = info.getValue();
      return (
        <div className="flex items-center gap-2 text-text-secondary">
          <Building2 className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <span className="text-sm truncate">{department.name}</span>
        </div>
      );
    },
    size: 140,
  }),

  columnHelper.accessor('employee.location', {
    id: 'location',
    header: 'Location',
    cell: (info) => {
      const location = info.getValue();
      return (
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <span className="text-sm">{location.name}</span>
        </div>
      );
    },
    size: 120,
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      return (
        <div className={cn('flex items-center gap-2', statusColors[status])}>
          {statusIcons[status]}
          <span className="text-sm">{statusLabels[status]}</span>
        </div>
      );
    },
    size: 110,
  }),

  columnHelper.accessor((row) => ({ start: row.startDate, end: row.endDate }), {
    id: 'dateRange',
    header: 'Period',
    cell: (info) => {
      const { start, end } = info.getValue();
      const isUpcoming = isFuture(start);
      const isOngoing = isPast(start) && isFuture(end);
      const isPastPeriod = isPast(end);
      
      return (
        <div className="space-y-0.5">
          <div className={cn(
            'text-sm',
            isOngoing && 'text-accent font-medium',
            isUpcoming && 'text-text-primary',
            isPastPeriod && 'text-text-tertiary'
          )}>
            {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
          </div>
          {isOngoing && (
            <div className="text-xs text-accent">Ongoing</div>
          )}
          {isUpcoming && (
            <div className="text-xs text-text-tertiary">
              In {differenceInDays(start, new Date())} days
            </div>
          )}
        </div>
      );
    },
    size: 160,
  }),

  columnHelper.accessor('daysRequested', {
    header: 'Days',
    cell: (info) => {
      const days = info.getValue();
      return (
        <span className="text-sm text-text-secondary">
          {days} {days === 1 ? 'day' : 'days'}
        </span>
      );
    },
    size: 80,
  }),

  columnHelper.accessor('employee.manager', {
    id: 'manager',
    header: 'Manager',
    cell: (info) => {
      const manager = info.getValue();
      if (!manager) {
        return <span className="text-text-tertiary text-sm">–</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-medium text-text-secondary shrink-0">
            {manager.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-text-secondary text-sm truncate">{manager.name}</span>
        </div>
      );
    },
    size: 160,
  }),

  columnHelper.accessor('employee.employmentType', {
    id: 'employmentType',
    header: 'Type',
    cell: (info) => {
      const type = info.getValue();
      return (
        <Badge 
          color={employmentTypeColors[type]}
          className="text-xs"
        >
          {employmentTypeLabels[type]}
        </Badge>
      );
    },
    size: 100,
  }),

  columnHelper.accessor('createdAt', {
    header: 'Requested',
    cell: (info) => (
      <span className="text-text-tertiary text-sm">
        {format(info.getValue(), 'MMM d, yyyy')}
      </span>
    ),
    size: 110,
  }),
];
