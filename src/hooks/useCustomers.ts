'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  customerService,
  CustomerResponseDto,
  CustomerFilters,
  CustomerSummaryDto,
  PaginatedCustomersWithSummary,
  CustomersWithSummary
} from '@/services/customer';
import { PaginationParams } from '@/services/base';

interface UseCustomersOptions {
  autoFetch?: boolean;
  pagination?: PaginationParams;
  filters?: CustomerFilters;
}

interface UseCustomersReturn {
  customers: CustomerResponseDto[];
  summary: CustomerSummaryDto | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalCustomers: number;
  currentPage: number;
  pageSize: number;
  fetchCustomers: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCustomers(options: UseCustomersOptions = {}): UseCustomersReturn {
  const {
    autoFetch = true,
    pagination = { page: 1, size: 10 },
    filters = {}
  } = options;

  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [summary, setSummary] = useState<CustomerSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(pagination.page || 1);
  const [pageSize, setPageSize] = useState(pagination.size || 10);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await customerService.getAllCustomers(
        { 
          page: currentPage, 
          size: pageSize,
          search: pagination.search 
        },
        filters
      );

      if (response.success && response.data) {
        const data = response.data;
        
        // Handle paginated response
        if ('items' in data) {
          const paginatedData = data as PaginatedCustomersWithSummary;
          setCustomers(paginatedData.items);
          setTotalPages(paginatedData.pages);
          setTotalCustomers(paginatedData.total);
          setSummary(paginatedData.summary || null);
        } else {
          // Handle array response
          const arrayData = data as CustomersWithSummary;
          setCustomers(arrayData);
          setTotalPages(1);
          setTotalCustomers(arrayData.length);
          setSummary(arrayData.summary || null);
        }
      } else {
        setError(response.message || 'Failed to fetch customers');
        setCustomers([]);
        setSummary(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCustomers([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, pagination.search, filters]);

  const refetch = useCallback(() => {
    return fetchCustomers();
  }, [fetchCustomers]);

  // Update pagination when props change
  useEffect(() => {
    setCurrentPage(pagination.page || 1);
    setPageSize(pagination.size || 10);
  }, [pagination.page, pagination.size]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCustomers();
    }
  }, [fetchCustomers, autoFetch]);

  return {
    customers,
    summary,
    isLoading,
    error,
    totalPages,
    totalCustomers,
    currentPage,
    pageSize,
    fetchCustomers,
    refetch,
  };
}

// Hook for customer summary only
export function useCustomerSummary() {
  const [summary, setSummary] = useState<CustomerSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await customerService.getCustomerSummary();
      
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        setError(response.message || 'Failed to fetch customer summary');
        setSummary(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}

// Hook for single customer
export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<CustomerResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await customerService.getCustomerById(id);
      
      if (response.success && response.data) {
        setCustomer(response.data);
      } else {
        setError(response.message || 'Customer not found');
        setCustomer(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomer,
  };
}