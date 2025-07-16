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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Download,
  Settings,
  Filter,
  X,
  Calendar,
  Search
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function DataTable({ 
  columns, 
  data, 
  onRowClick, 
  loading = false,
  onSelectionChange,
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
  const [dateFilters, setDateFilters] = useState({});
  const [rangeFilters, setRangeFilters] = useState({});

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

  // Advanced filtering functions
  const applyDateFilter = (columnId, startDate, endDate) => {
    setDateFilters(prev => ({
      ...prev,
      [columnId]: { startDate, endDate }
    }));
    
    const column = table.getColumn(columnId);
    if (column) {
      column.setFilterValue([startDate, endDate]);
    }
  };

  const applyRangeFilter = (columnId, min, max) => {
    setRangeFilters(prev => ({
      ...prev,
      [columnId]: { min, max }
    }));
    
    const column = table.getColumn(columnId);
    if (column) {
      column.setFilterValue([min, max]);
    }
  };

  const clearAllFilters = () => {
    setGlobalFilter('');
    setColumnFilters([]);
    setDateFilters({});
    setRangeFilters({});
    table.resetColumnFilters();
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
    <div className="bg-hospital-white rounded-md shadow-md overflow-hidden">
      <div className="p-4">
        <Skeleton height={40} className="mb-4 max-w-sm" />
      </div>
      <div className="min-w-full">
        <div className="bg-hospital-gray-50 px-6 py-3">
          <Skeleton height={20} count={1} />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`px-6 py-4 ${i % 2 === 0 ? 'bg-hospital-white' : 'bg-hospital-gray-50'}`}>
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
    <div className="bg-hospital-white rounded-md shadow-md overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-hospital-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hospital-gray-400" />
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
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <span className="text-sm text-blue-700">
              {Object.keys(rowSelection).length} row(s) selected
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setRowSelection({})}
              className="ml-2 text-blue-700"
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* Column Manager */}
        {showColumnManager && enableColumnManagement && (
          <div className="mt-3 p-3 bg-hospital-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">Manage Columns</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColumnManager(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {table.getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <label key={column.id} className="flex items-center space-x-2 text-sm">
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    />
                    <span>{column.columnDef.header}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvancedFilters && enableAdvancedFiltering && (
          <div className="mt-3 p-3 bg-hospital-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">Advanced Filters</h3>
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
                    <label className="text-xs font-medium text-hospital-gray-600">
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
        <table className="min-w-full divide-y divide-hospital-gray-200">
          <thead className="bg-hospital-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-hospital-gray-600 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-hospital-white divide-y divide-hospital-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  hover:bg-hospital-gray-100 cursor-pointer transition-colors duration-200
                  ${enableRowStriping && index % 2 === 1 ? 'bg-hospital-gray-50' : 'bg-hospital-white'}
                  ${row.getIsSelected() ? 'bg-blue-50' : ''}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-hospital-gray-900"
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
      <div className="flex items-center justify-between p-4 bg-hospital-gray-50">
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
          <span className="text-sm text-hospital-gray-600">
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
          <span className="text-sm text-hospital-gray-600">
            {table.getFilteredRowModel().rows.length} total rows
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="p-2 border rounded-md text-sm text-hospital-gray-600"
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