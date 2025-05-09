import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { User } from '../types/models.types';
import { UpdateProfileRequest } from '../types/api.types';

/**
 * Get user profile by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const doc = await firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    if (!doc.exists) {
      throw new Error('User not found');
    }
    
    return {
      id: doc.id,
      ...doc.data()
    } as User;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: UpdateProfileRequest, 
  photoFile?: string
): Promise<User> => {
  try {
    // Upload photo if provided
    let photoURL = profileData.photoURL;
    
    if (photoFile) {
      const fileReference = storage().ref(`profile_photos/${userId}`);
      await fileReference.putFile(photoFile);
      photoURL = await fileReference.getDownloadURL();
    }
    
    const updateData = {
      ...profileData,
      photoURL: photoURL || undefined,
      updatedAt: firestore.Timestamp.now().toDate().toISOString(),
    };
    
    await firestore()
      .collection('users')
      .doc(userId)
      .update(updateData);
    
    const updatedUserDoc = await firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    return {
      id: userId,
      ...updatedUserDoc.data()
    } as User;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Search users by role and skills
 */
export const searchUsers = async (role?: string, skills?: string[]): Promise<User[]> => {
  try {
    let query = firestore().collection('users');
    
    if (role) {
      query = query.where('role', '==', role);
    }
    
    const snapshot = await query.get();
    
    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    // Filter by skills if provided (Firestore doesn't support array-contains-any with other filters)
    if (skills && skills.length > 0) {
      users = users.filter(user => {
        if (!user.skills) return false;
        return skills.some(skill => user.skills?.includes(skill));
      });
    }
    
    return users;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

/**
 * Get workers for a specific job
 */
export const getJobWorkers = async (jobId: string): Promise<User[]> => {
  try {
    const jobDoc = await firestore()
      .collection('jobs')
      .doc(jobId)
      .get();
    
    if (!jobDoc.exists) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    const workerIds = jobData?.assignedWorkers || [];
    
    if (workerIds.length === 0) {
      return [];
    }
    
    // Firestore has a limit of 10 values for 'in' queries, so we need to batch
    const userPromises = [];
    for (let i = 0; i < workerIds.length; i += 10) {
      const batch = workerIds.slice(i, i + 10);
      userPromises.push(
        firestore()
          .collection('users')
          .where(firestore.FieldPath.documentId(), 'in', batch)
          .get()
      );
    }
    
    const userSnapshots = await Promise.all(userPromises);
    
    let users: User[] = [];
    userSnapshots.forEach(snapshot => {
      const batchUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      users = [...users, ...batchUsers];
    });
    
    return users;
  } catch (error) {
    console.error('Get job workers error:', error);
    throw error;
  }
};

/**
 * Get job applicants
 */
export const getJobApplicants = async (jobId: string): Promise<User[]> => {
  try {
    const jobDoc = await firestore()
      .collection('jobs')
      .doc(jobId)
      .get();
    
    if (!jobDoc.exists) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    const applicantIds = jobData?.applicants || [];
    
    if (applicantIds.length === 0) {
      return [];
    }
    
    // Firestore has a limit of 10 values for 'in' queries, so we need to batch
    const userPromises = [];
    for (let i = 0; i < applicantIds.length; i += 10) {
      const batch = applicantIds.slice(i, i + 10);
      userPromises.push(
        firestore()
          .collection('users')
          .where(firestore.FieldPath.documentId(), 'in', batch)
          .get()
      );
    }
    
    const userSnapshots = await Promise.all(userPromises);
    
    let users: User[] = [];
    userSnapshots.forEach(snapshot => {
      const batchUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      users = [...users, ...batchUsers];
    });
    
    return users;
  } catch (error) {
    console.error('Get job applicants error:', error);
    throw error;
  }
};

/**
 * Update user's availability status
 */
export const updateAvailability = async (
  userId: string, 
  availability: { available: boolean; availableFrom?: string; availableTo?: string }
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        availability,
        updatedAt: firestore.Timestamp.now().toDate().toISOString(),
      });
  } catch (error) {
    console.error('Update availability error:', error);
    throw error;
  }
};