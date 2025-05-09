// API Response Types
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  // Authentication API
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface SignUpRequest {
    email: string;
    password: string;
    displayName: string;
    role: 'worker' | 'manager' | 'admin';
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      displayName: string | null;
      photoURL: string | null;
      role: 'admin' | 'manager' | 'worker';
    };
  }
  
  // Job API
  export interface CreateJobRequest {
    title: string;
    description: string;
    location: string;
    company: string;
    companyLogo?: string;
    salary: {
      amount: number;
      period: 'hourly' | 'daily' | 'weekly' | 'monthly';
    };
    requirements: string[];
    category: string;
    startDate: string;
    endDate?: string;
  }
  
  export interface UpdateJobRequest extends Partial<CreateJobRequest> {
    status?: 'open' | 'in-progress' | 'completed' | 'cancelled';
  }
  
  export interface JobFilterRequest {
    category?: string;
    location?: string;
    minSalary?: number;
    maxSalary?: number;
    startDate?: string;
    endDate?: string;
    status?: 'open' | 'in-progress' | 'completed' | 'cancelled';
  }
  
  // User API
  export interface UpdateProfileRequest {
    displayName?: string;
    phone?: string;
    address?: string;
    skills?: string[];
    experience?: string;
    availability?: {
      available: boolean;
      availableFrom?: string;
      availableTo?: string;
    };
    photoURL?: string;
  }
  
  // Application API
  export interface CreateApplicationRequest {
    jobId: string;
    notes?: string;
  }
  
  export interface UpdateApplicationRequest {
    status: 'pending' | 'accepted' | 'rejected';
    notes?: string;
  }