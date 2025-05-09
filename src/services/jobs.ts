import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Job } from '../types/models.types';
import { 
  CreateJobRequest, 
  UpdateJobRequest, 
  JobFilterRequest 
} from '../types/api.types';

/**
 * Get all jobs with optional filtering
 */
export const getAllJobs = async (filters?: JobFilterRequest): Promise<Job[]> => {
  try {
    let query = firestore().collection('jobs');
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      if (filters.location) {
        query = query.where('location', '==', filters.location);
      }
      
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      
      if (filters.startDate) {
        query = query.where('startDate', '>=', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.where('endDate', '<=', filters.endDate);
      }
      
      // For salary filtering, we need to fetch all and filter locally
      // as Firestore doesn't support range queries on multiple fields
    }
    
    // Order by creation date (newest first)
    query = query.orderBy('createdAt', 'desc');
    
    const snapshot = await query.get();
    
    let jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
    
    // Apply salary filters if provided
    if (filters?.minSalary !== undefined || filters?.maxSalary !== undefined) {
      jobs = jobs.filter(job => {
        if (filters.minSalary !== undefined && job.salary.amount < filters.minSalary) {
          return false;
        }
        
        if (filters.maxSalary !== undefined && job.salary.amount > filters.maxSalary) {
          return false;
        }
        
        return true;
      });
    }
    
    return jobs;
  } catch (error) {
    console.error('Get jobs error:', error);
    throw error;
  }
};

/**
 * Get job by ID
 */
export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const doc = await firestore()
      .collection('jobs')
      .doc(jobId)
      .get();
    
    if (!doc.exists) {
      throw new Error('Job not found');
    }
    
    return {
      id: doc.id,
      ...doc.data()
    } as Job;
  } catch (error) {
    console.error('Get job error:', error);
    throw error;
  }
};

/**
 * Create a new job
 */
export const createJob = async (jobData: CreateJobRequest, userId: string, companyLogoFile?: string): Promise<Job> => {
  try {
    // Upload company logo if provided
    let companyLogo = jobData.companyLogo;
    
    if (companyLogoFile) {
      const fileReference = storage().ref(`company_logos/${Date.now()}`);
      await fileReference.putFile(companyLogoFile);
      companyLogo = await fileReference.getDownloadURL();
    }
    
    const jobRef = firestore().collection('jobs').doc();
    
    const newJob: Omit<Job, 'id'> = {
      ...jobData,
      companyLogo,
      status: 'open',
      createdAt: firestore.Timestamp.now().toDate().toISOString(),
      updatedAt: firestore.Timestamp.now().toDate().toISOString(),
      createdBy: userId,
      applicants: [],
      assignedWorkers: [],
    };
    
    await jobRef.set(newJob);
    
    return {
      id: jobRef.id,
      ...newJob,
    };
  } catch (error) {
    console.error('Create job error:', error);
    throw error;
  }
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId: string, jobData: UpdateJobRequest, companyLogoFile?: string): Promise<Job> => {
  try {
    // Get current job data
    const jobDoc = await firestore()
      .collection('jobs')
      .doc(jobId)
      .get();
    
    if (!jobDoc.exists) {
      throw new Error('Job not found');
    }
    
    // Upload company logo if provided
    let companyLogo = jobData.companyLogo;
    
    if (companyLogoFile) {
      const fileReference = storage().ref(`company_logos/${Date.now()}`);
      await fileReference.putFile(companyLogoFile);
      companyLogo = await fileReference.getDownloadURL();
    }
    
    const updatedJob = {
      ...jobData,
      companyLogo: companyLogo || undefined,
      updatedAt: firestore.Timestamp.now().toDate().toISOString(),
    };
    
    await firestore()
      .collection('jobs')
      .doc(jobId)
      .update(updatedJob);
    
    return {
      id: jobId,
      ...jobDoc.data(),
      ...updatedJob,
    } as Job;
  } catch (error) {
    console.error('Update job error:', error);
    throw error;
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await firestore()
      .collection('jobs')
      .doc(jobId)
      .delete();
  } catch (error) {
    console.error('Delete job error:', error);
    throw error;
  }
};

/**
 * Apply for a job
 */
export const applyForJob = async (jobId: string, userId: string, notes?: string): Promise<void> => {
  try {
    const batch = firestore().batch();
    
    // Add user to job applicants
    const jobRef = firestore().collection('jobs').doc(jobId);
    batch.update(jobRef, {
      applicants: firestore.FieldValue.arrayUnion(userId),
      updatedAt: firestore.Timestamp.now().toDate().toISOString(),
    });
    
    // Create application document
    const applicationRef = firestore().collection('applications').doc();
    batch.set(applicationRef, {
      jobId,
      userId,
      status: 'pending',
      notes,
      appliedAt: firestore.Timestamp.now().toDate().toISOString(),
      updatedAt: firestore.Timestamp.now().toDate().toISOString(),
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Apply for job error:', error);
    throw error;
  }
};

/**
 * Get jobs created by user
 */
export const getJobsByUser = async (userId: string): Promise<Job[]> => {
  try {
    const snapshot = await firestore()
      .collection('jobs')
      .where('createdBy', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
  } catch (error) {
    console.error('Get user jobs error:', error);
    throw error;
  }
};

/**
 * Get jobs that a user has applied for
 */
export const getAppliedJobs = async (userId: string): Promise<Job[]> => {
  try {
    const applications = await firestore()
      .collection('applications')
      .where('userId', '==', userId)
      .get();
    
    const jobIds = applications.docs.map(doc => doc.data().jobId);
    
    if (jobIds.length === 0) {
      return [];
    }
    
    // Firestore has a limit of 10 values for 'in' queries, so we need to batch
    const jobPromises = [];
    for (let i = 0; i < jobIds.length; i += 10) {
      const batch = jobIds.slice(i, i + 10);
      jobPromises.push(
        firestore()
          .collection('jobs')
          .where(firestore.FieldPath.documentId(), 'in', batch)
          .get()
      );
    }
    
    const jobSnapshots = await Promise.all(jobPromises);
    
    let jobs: Job[] = [];
    jobSnapshots.forEach(snapshot => {
      const batchJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      jobs = [...jobs, ...batchJobs];
    });
    
    return jobs;
  } catch (error) {
    console.error('Get applied jobs error:', error);
    throw error;
  }
};

/**
 * Get jobs that a user is assigned to
 */
export const getAssignedJobs = async (userId: string): Promise<Job[]> => {
  try {
    const snapshot = await firestore()
      .collection('jobs')
      .where('assignedWorkers', 'array-contains', userId)
      .orderBy('startDate', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
  } catch (error) {
    console.error('Get assigned jobs error:', error);
    throw error;
  }
};