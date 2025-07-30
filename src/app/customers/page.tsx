'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { 
  CustomerTable, 
  CustomerCards, 
  CustomerFilters,
  CustomerStats
} from '@/components/customer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCustomers } from '@/hooks/useCustomers';
import { 
  Grid3X3, 
  List, 
  Plus, 
  Download, 
  Upload,
  RefreshCw
} from 'lucide-react';
import { CustomerResponseDto, CustomerFilters as CustomerFiltersType } from '@/services/customer';

type ViewMode = 'table' | 'cards';

export default function CustomersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CustomerFiltersType>({});

  const { 
    customers, 
    summary,
    isLoading, 
    error, 
    totalPages, 
    totalCustomers,
    refetch 
  } = useCustomers({
    pagination: { 
      page: currentPage, 
      size: pageSize, 
      search: searchQuery 
    },
    filters
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFiltersChange = (newFilters: CustomerFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewCustomer = (customer: CustomerResponseDto) => {
    // TODO: Navigate to customer detail page or open modal
    console.log('View customer:', customer);
  };

  const handleEditCustomer = (customer: CustomerResponseDto) => {
    // TODO: Navigate to customer edit page or open modal
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = (customer: CustomerResponseDto) => {
    // TODO: Show confirmation dialog and delete customer
    console.log('Delete customer:', customer);
  };

  const handleAddCustomer = () => {
    // TODO: Navigate to add customer page or open modal
    console.log('Add new customer');
  };

  const handleExport = () => {
    // TODO: Export customers data
    console.log('Export customers');
  };

  const handleImport = () => {
    // TODO: Open import dialog
    console.log('Import customers');
  };

  const getStatusMessage = () => {
    if (error) return `Error: ${error}`;
    if (isLoading) return 'Loading customers...';
    if (totalCustomers === 0) return 'No customers found';
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCustomers);
    return `Showing ${start}-${end} of ${totalCustomers} customers`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage and view your customer database
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleAddCustomer}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <CustomerStats summary={summary} isLoading={isLoading} />

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Customer List</CardTitle>
                <CardDescription>{getStatusMessage()}</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Filters */}
            <CustomerFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />

            {/* Content based on view mode */}
            {viewMode === 'table' ? (
              <CustomerTable
                customers={customers}
                isLoading={isLoading}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            ) : (
              <CustomerCards
                customers={customers}
                isLoading={isLoading}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : currentPage - 2 + i;
                      
                      if (pageNumber < 1 || pageNumber > totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={isLoading}
                          className="w-10"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}