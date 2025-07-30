import { BaseApiService, ApiResponse, PaginationParams, PaginatedResponse } from './base';

// Customer types matching backend
export interface CustomerResponseDto {
  _id: string;
  number: number;
  locationName: string;
  date: string;
  loginHour: string;
  userName: string;
  birthYear: number;
  actualAge: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phoneNumber: string;
  deviceBrand: 'samsung' | 'apple' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'other';
  digitalInterest: 'socialMedia' | 'gaming' | 'shopping' | 'news' | 'entertainment' | 'education' | 'health' | 'finance' | 'travel' | 'food' | 'other';
  locationType: 'urban' | 'suburban' | 'rural';
  loginDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  number: number;
  locationName: string;
  date: string;
  loginHour: string;
  userName: string;
  birthYear: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phoneNumber: string;
  deviceBrand: 'samsung' | 'apple' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'other';
  digitalInterest: 'socialMedia' | 'gaming' | 'shopping' | 'news' | 'entertainment' | 'education' | 'health' | 'finance' | 'travel' | 'food' | 'other';
  locationType: 'urban' | 'suburban' | 'rural';
}

export interface UpdateCustomerDto {
  locationName?: string;
  date?: string;
  loginHour?: string;
  userName?: string;
  birthYear?: number;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  phoneNumber?: string;
  deviceBrand?: 'samsung' | 'apple' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'other';
  digitalInterest?: 'socialMedia' | 'gaming' | 'shopping' | 'news' | 'entertainment' | 'education' | 'health' | 'finance' | 'travel' | 'food' | 'other';
  locationType?: 'urban' | 'suburban' | 'rural';
}

export interface CustomerFilters {
  gender?: 'male' | 'female' | 'other';
  minAge?: number;
  maxAge?: number;
  locationName?: string;
  locationType?: 'urban' | 'suburban' | 'rural';
  deviceBrand?: 'samsung' | 'apple' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'other';
  digitalInterest?: 'socialMedia' | 'gaming' | 'shopping' | 'news' | 'entertainment' | 'education' | 'health' | 'finance' | 'travel' | 'food' | 'other';
  startDate?: string;
  endDate?: string;
}

export interface CustomerSummaryDto {
  totalCustomers: number;
  uniqueLocations: number;
  avgAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  deviceDistribution: {
    samsung: number;
    apple: number;
    huawei: number;
    xiaomi: number;
    oppo: number;
    vivo: number;
    other: number;
  };
  locationDistribution: {
    urban: number;
    suburban: number;
    rural: number;
  };
  interestDistribution: {
    socialMedia: number;
    gaming: number;
    shopping: number;
    news: number;
    entertainment: number;
    education: number;
    health: number;
    finance: number;
    travel: number;
    food: number;
    other: number;
  };
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
}

export interface PaginatedCustomersWithSummary {
  items: CustomerResponseDto[];
  total: number;
  page: number;
  size: number;
  pages: number;
  summary?: CustomerSummaryDto | null;
}

export interface CustomersWithSummary extends Array<CustomerResponseDto> {
  summary?: CustomerSummaryDto | null;
}

// Customer API Service
export class CustomerService extends BaseApiService {
  private readonly endpoint = '/customers';

  // Get all customers with pagination and filters
  async getAllCustomers(
    pagination?: PaginationParams,
    filters?: CustomerFilters
  ): Promise<ApiResponse<PaginatedCustomersWithSummary | CustomersWithSummary>> {
    const params = {
      ...pagination,
      ...filters,
    };
    return this.get<PaginatedCustomersWithSummary | CustomersWithSummary>(this.endpoint, params);
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<ApiResponse<CustomerResponseDto | null>> {
    return this.get<CustomerResponseDto | null>(`${this.endpoint}/${id}`);
  }

  // Create new customer
  async createCustomer(customerData: CreateCustomerDto): Promise<ApiResponse<CustomerResponseDto>> {
    return this.post<CustomerResponseDto>(this.endpoint, customerData);
  }

  // Update customer
  async updateCustomer(id: string, updateData: UpdateCustomerDto): Promise<ApiResponse<CustomerResponseDto | null>> {
    return this.put<CustomerResponseDto | null>(`${this.endpoint}/${id}`, updateData);
  }

  // Delete customer
  async deleteCustomer(id: string): Promise<ApiResponse<CustomerResponseDto | null>> {
    return this.delete<CustomerResponseDto | null>(`${this.endpoint}/${id}`);
  }

  // Get customer summary for dashboard
  async getCustomerSummary(): Promise<ApiResponse<CustomerSummaryDto>> {
    return this.get<CustomerSummaryDto>(`${this.endpoint}/summary`);
  }

  // CSV Import methods
  async importCustomersFromCSV(
    file: File,
    options?: {
      skipValidation?: boolean;
      continueOnError?: boolean;
      batchSize?: number;
    }
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('csvFile', file);
    
    if (options?.skipValidation) {
      formData.append('skipValidation', 'true');
    }
    if (options?.continueOnError !== undefined) {
      formData.append('continueOnError', options.continueOnError.toString());
    }
    if (options?.batchSize) {
      formData.append('batchSize', options.batchSize.toString());
    }

    try {
      const response = await this.api.post<ApiResponse<any>>(`${this.endpoint}/import/csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 10 minutes for large files
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get import status
  async getImportStatus(importId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`${this.endpoint}/import/status/${importId}`);
  }

  // Cancel import
  async cancelImport(importId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/import/cancel/${importId}`);
  }

  // Get active imports
  async getActiveImports(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`${this.endpoint}/import/active`);
  }
}

// Export singleton instance
export const customerService = new CustomerService();