// Core model interfaces for the app

export interface User {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    phone?: string;
    address?: string;
    skills?: string[];
    experience?: string;
    availability?: Availability;
    rating?: number;
    completedJobs?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export type UserRole = 'admin' | 'manager' | 'worker';
  
  export interface Availability {
    available: boolean;
    availableFrom?: string;
    availableTo?: string;
  }
  
  export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    company: string;
    companyLogo?: string;
    salary: Salary;
    requirements: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    startDate: string;
    endDate?: string;
    status: JobStatus;
    createdBy: string;
    applicants?: string[];
    assignedWorkers?: string[];
  }
  
  export interface Salary {
    amount: number;
    period: SalaryPeriod;
  }
  
  export type SalaryPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  export type JobStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';
  
  export interface Application {
    id: string;
    jobId: string;
    userId: string;
    status: ApplicationStatus;
    appliedAt: string;
    updatedAt: string;
    notes?: string;
  }
  
  export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
  
  export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    relatedId?: string; // ID of job, application, etc.
    relatedType?: 'job' | 'application' | 'user';
  }
  
  export type NotificationType = 'info' | 'success' | 'warning' | 'error';
  
  export interface Rating {
    id: string;
    jobId: string;
    fromUserId: string;
    toUserId: string;
    score: number; // 1-5
    comment?: string;
    createdAt: string;
  }