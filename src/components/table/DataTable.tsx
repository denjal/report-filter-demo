import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { columns } from './columns';
import { cn } from '../../lib/cn';
import type { AbsenceRequest } from '../../types/filters';

interface DataTableProps {
  data: AbsenceRequest[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // Generate page numbers to show (max 5 pages with ellipsis)
  const getPageNumbers = () => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }
    
    const pages: (number | 'ellipsis')[] = [];
    if (currentPage <= 2) {
      pages.push(0, 1, 2, 'ellipsis', pageCount - 1);
    } else if (currentPage >= pageCount - 3) {
      pages.push(0, 'ellipsis', pageCount - 3, pageCount - 2, pageCount - 1);
    } else {
      pages.push(0, 'ellipsis', currentPage, 'ellipsis', pageCount - 1);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Table container */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-surface-1">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:text-text-secondary transition-colors'
                      )}
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-text-tertiary">
                            {{
                              asc: <ChevronUp className="h-3.5 w-3.5" />,
                              desc: <ChevronDown className="h-3.5 w-3.5" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'hover:bg-surface-2 transition-colors',
                      idx % 2 === 0 ? 'bg-surface-0' : 'bg-surface-1/30'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-text-tertiary"
                  >
                    No absence requests match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-text-tertiary">
          Showing{' '}
          <span className="font-medium text-text-secondary">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>
          {' '}to{' '}
          <span className="font-medium text-text-secondary">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}
          </span>
          {' '}of{' '}
          <span className="font-medium text-text-secondary">{data.length}</span>
          {' '}requests
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageIndex, idx) => 
              pageIndex === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-text-tertiary">...</span>
              ) : (
                <Button
                  key={pageIndex}
                  variant={pageIndex === currentPage ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => table.setPageIndex(pageIndex)}
                  className="w-8 h-8 p-0"
                >
                  {pageIndex + 1}
                </Button>
              )
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
