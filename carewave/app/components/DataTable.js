'use client';

import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Download,
  Settings,
  Filter,
  X,
  Search,
  Check
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Custom Button Component
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  disabled = false, 
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-white text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)]',
    outline: 'bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)]',
    ghost: 'bg-transparent text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-100)] focus:ring-[var(--hospital-accent)]',
    link: 'bg-transparent text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] underline-offset-4 hover:underline',
    primary: 'bg-[var(--hospital-accent)] text-white hover:bg-[var(--hospital-accent-dark)] focus:ring-[var(--hospital-accent)]',
    secondary: 'bg-[var(--hospital-gray-200)] text-[var(--hospital-gray-800)] hover:bg-[var(--hospital-gray-300)] focus:ring-[var(--hospital-gray-400)]'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ 
  placeholder, 
  value, 
  onChange, 
  className = '',
  disabled = false,
  type = 'text',
  ...props 
}) => {
  const baseStyles = 'flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
};

// Custom Checkbox Component
const Checkbox = ({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={`
          h-4 w-4 rounded border-2 border-[var(--hospital-gray-400)] bg-white cursor-pointer transition-all duration-200
          ${checked ? 'bg-[var(--hospital-accent)] border-[var(--hospital-accent)]' : 'hover:border-[var(--hospital-gray-500)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        onClick={() => !disabled && onCheckedChange(!checked)}
      >
        {checked && (
          <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5 transform -translate-x-0.5 -translate-y-0.5" />
        )}
      </div>
    </div>
  );
};

export function DataTable({ 
  columns, 
  data, 
  loading = false,
  onSelectionChange,
  onRowClick,
  enableRowSelection = true,
  enableColumnManagement = true,
  enableExport = true,
  enableAdvancedFiltering = true,
  enableRowStriping = true
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Enhanced columns with selection checkbox
  const enhancedColumns = useMemo(() => {
    const selectionColumn = enableRowSelection ? [{
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }] : [];

    return [...selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data: data || [],
    columns: enhancedColumns,
    state: { 
      sorting, 
      globalFilter, 
      columnFilters,
      rowSelection,
      columnVisibility
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: enableRowSelection,
    initialState: { pagination: { pageSize: 10 } },
  });

  // Export functionality
  const exportToCSV = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const rowsToExport = selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;
    
    const headers = table.getVisibleFlatColumns()
      .filter(col => col.id !== 'select')
      .map(col => col.columnDef.header);
    
    const csvData = rowsToExport.map(row => 
      row.getVisibleCells()
        .filter(cell => cell.column.id !== 'select')
        .map(cell => {
          const value = cell.getValue();
          return typeof value === 'string' ? `"${value}"` : value;
        })
    );

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const rowsToExport = selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;
    
    const jsonData = rowsToExport.map(row => row.original);
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-export.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setGlobalFilter('');
    setColumnFilters([]);
    table.resetColumnFilters();
  };

  // Handle row click
  const handleRowClick = (row, event) => {
    // Don't trigger row click if clicking on action buttons, checkboxes, or other interactive elements
    if (
      event.target.closest('button') ||
      event.target.closest('a') ||
      event.target.closest('input') ||
      event.target.closest('[data-no-row-click]')
    ) {
      return;
    }

    if (onRowClick) {
      onRowClick(row.original, row);
    }
  };

  // Selection change callback
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-[var(--hospital-white)] rounded-md shadow-[var(--shadow-md)] overflow-hidden">
      <div className="p-4">
        <Skeleton height={40} className="mb-4 max-w-sm" />
      </div>
      <div className="min-w-full">
        <div className="bg-[var(--hospital-gray-50)] px-6 py-3">
          <Skeleton height={20} count={1} />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`px-6 py-4 ${i % 2 === 0 ? 'bg-[var(--hospital-white)]' : 'bg-[var(--hospital-gray-50)]'}`}>
            <Skeleton height={16} count={1} />
          </div>
        ))}
      </div>
      <div className="p-4">
        <Skeleton height={32} width={200} />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-[var(--hospital-white)] rounded-md shadow-[var(--shadow-md)] overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-[var(--hospital-gray-200)]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--hospital-gray-400)]" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {enableAdvancedFiltering && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            )}
            
            {enableColumnManagement && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnManager(!showColumnManager)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Columns
              </Button>
            )}
            
            {enableExport && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToJSON}
                >
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Selection Info */}
        {enableRowSelection && Object.keys(rowSelection).length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <span className="text-sm text-blue-700 font-medium">
              {Object.keys(rowSelection).length} row(s) selected
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setRowSelection({})}
              className="ml-2 text-blue-700 hover:text-blue-800"
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* Column Manager */}
        {showColumnManager && enableColumnManagement && (
          <div className="mt-3 p-4 bg-[var(--hospital-gray-50)] rounded-md border border-[var(--hospital-gray-200)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm text-[var(--hospital-gray-700)]">Manage Columns</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColumnManager(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {table.getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <label key={column.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-[var(--hospital-gray-100)] p-2 rounded">
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    />
                    <span className="text-[var(--hospital-gray-700)]">{column.columnDef.header}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvancedFilters && enableAdvancedFiltering && (
          <div className="mt-3 p-4 bg-[var(--hospital-gray-50)] rounded-md border border-[var(--hospital-gray-200)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm text-[var(--hospital-gray-700)]">Advanced Filters</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {table.getAllColumns()
                .filter(column => column.getCanFilter() && column.id !== 'select')
                .map(column => (
                  <div key={column.id} className="space-y-2">
                    <label className="text-xs font-medium text-[var(--hospital-gray-600)]">
                      {column.columnDef.header}
                    </label>
                    <Input
                      placeholder={`Filter ${column.columnDef.header}`}
                      value={column.getFilterValue() ?? ''}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      className="h-8"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--hospital-gray-200)]">
          <thead className="bg-[var(--hospital-gray-50)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--hospital-gray-600)] uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer select-none hover:text-[var(--hospital-gray-800)] transition-colors duration-200"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <span className="text-[var(--hospital-accent)] font-bold">↑</span>,
                        desc: <span className="text-[var(--hospital-accent)] font-bold">↓</span>,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-[var(--hospital-white)] divide-y divide-[var(--hospital-gray-200)]">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                onClick={(event) => handleRowClick(row, event)}
                className={`
                  hover:bg-[var(--hospital-gray-100)] transition-colors duration-200
                  ${enableRowStriping && index % 2 === 1 ? 'bg-[var(--hospital-gray-50)]' : 'bg-[var(--hospital-white)]'}
                  ${row.getIsSelected() ? 'bg-blue-50 border-l-4 border-[var(--hospital-accent)]' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-[var(--hospital-gray-900)]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-[var(--hospital-gray-50)] border-t border-[var(--hospital-gray-200)]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-[var(--hospital-gray-600)] font-medium px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--hospital-gray-600)] font-medium">
            {table.getFilteredRowModel().rows.length} total rows
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-3 py-2 border border-[var(--hospital-gray-300)] rounded-md text-sm text-[var(--hospital-gray-600)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent transition-all duration-200"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default DataTable;