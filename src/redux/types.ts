// Auth related types
export interface AuthState {
    token: string | null;
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
  }
  
  // User related types
  export interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
  }
  
  // Jobs related types
  export interface JobsState {
    jobs: Job[];
    currentJob: Job | null;
    isLoading: boolean;
    error: string | null;
  }
  
  // Data models
  export interface UserData {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    role: 'admin' | 'manager' | 'worker';
  }
  
  export interface UserProfile extends UserData {
    phone: string | null;
    address: string | null;
    skills: string[];
    experience: string | null;
    availability: {
      available: boolean;
      availableFrom?: string;
      availableTo?: string;
    };
    rating: number;
    completedJobs: number;
  }
  
  export interface Job {
    id: string;
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
    createdAt: string;
    startDate: string;
    endDate?: string;
    status: 'open' | 'in-progress' | 'completed' | 'cancelled';
    applicants?: string[];
    assignedWorkers?: string[];
  }
  
  // Application types
  export interface Application {
    id: string;
    jobId: string;
    userId: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
    notes?: string;
  }