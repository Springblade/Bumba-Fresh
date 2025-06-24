// Profile service for user profile management
// Integrated with backend API for persistent profile updates

import { fetchData } from './api';

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  deliveredOrders: number;
  activeSubscriptions: number;
}

interface ProfileResponse {
  profile: ProfileData;
  stats: UserStats;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
}

class ProfileService {
  async getUserProfile(): Promise<ProfileResponse> {
    try {
      console.log('ProfileService: Fetching user profile from backend API...');
      // First try to fetch from backend API
      const response = await fetchData<ProfileResponse>('/users/profile');
      console.log('ProfileService: Successfully fetched profile from backend:', response);
      
      // Update localStorage with fresh data from backend
      if (response.profile) {
        const currentUser = localStorage.getItem('currentUser');        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedUserData = {
            ...userData,
            firstName: response.profile.firstName,
            lastName: response.profile.lastName
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
          console.log('ProfileService: Updated localStorage with fresh profile data');
        }
      }
      
      return response;
    } catch (error) {
      console.warn('ProfileService: Failed to fetch profile from backend, falling back to localStorage:', error);
      
      // Fallback to localStorage if API is unavailable
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('No user data found');
      }

      const userData = JSON.parse(currentUser);
      
      const profile: ProfileData = {        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock stats for fallback
      const stats: UserStats = {
        totalOrders: 0,
        totalSpent: 0,
        deliveredOrders: 0,
        activeSubscriptions: 0
      };

      console.log('ProfileService: Using fallback localStorage data:', { profile, stats });
      return { profile, stats };
    }
  }
  async updateUserProfile(data: UpdateProfileData): Promise<{ message: string; profile: ProfileData }> {
    try {
      console.log('ProfileService: Updating user profile via backend API...', data);
      
      // Validate required authentication token
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }      // First try to update via backend API
      const response = await fetchData<{ message: string; profile: ProfileData }>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      console.log('ProfileService: Successfully updated profile via backend:', response);

      // Update localStorage with the updated profile data from backend
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && response.profile) {
        const userData = JSON.parse(currentUser);        const updatedUserData = {
          ...userData,
          firstName: response.profile.firstName,
          lastName: response.profile.lastName
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        console.log('ProfileService: Updated localStorage with backend response');
      }

      return response;
    } catch (error) {
      console.warn('ProfileService: Failed to update profile via backend, falling back to localStorage:', error);
      
      // Check if this is an authentication error
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('authentication'))) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Fallback to localStorage update if API is unavailable
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('No user data found. Please log in again.');
      }

      const userData = JSON.parse(currentUser);
        // Update the current user data with new profile information
      const updatedUserData = {
        ...userData,
        firstName: data.firstName || userData.firstName,
        lastName: data.lastName || userData.lastName
      };

      // Update current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

      // Create updated profile data
      const profile: ProfileData = {        id: updatedUserData.id,
        email: updatedUserData.email,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('ProfileService: Using fallback localStorage update:', { profile });
      console.warn('ProfileService: WARNING - Profile updated only locally. Changes may not persist across sessions.');
      
      return {
        message: 'Profile updated successfully (offline mode - changes saved locally)',
        profile
      };
    }
  }
}

export const profileService = new ProfileService();
export type { ProfileData, UserStats, UpdateProfileData };
