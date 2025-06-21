// Profile service for user profile management
// Currently using localStorage for mock data until database is connected

interface ProfileData {
  id: string;
  username: string;
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
  phone?: string;
  address?: string;
}

class ProfileService {
  async getUserProfile(): Promise<ProfileResponse> {
    // Updated to work with real authentication system from Duc-Database branch
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('No user data found');
    }

    const userData = JSON.parse(currentUser);
    
    // Use the currentUser data directly since we have real authentication
    // No need to look in fakeUsers array anymore
    const profile: ProfileData = {
      id: userData.id,
      username: userData.email.split('@')[0], // Generate username from email
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      address: userData.address ? (typeof userData.address === 'string' ? userData.address : `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}`.trim()) : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Mock stats
    const stats: UserStats = {
      totalOrders: 0,
      totalSpent: 0,
      deliveredOrders: 0,
      activeSubscriptions: 0
    };

    return { profile, stats };
  }
  async updateUserProfile(data: UpdateProfileData): Promise<{ message: string; profile: ProfileData }> {
    // Updated to work with real authentication system
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('No user data found');
    }

    const userData = JSON.parse(currentUser);
    
    // Update the current user data with new profile information
    const updatedUserData = {
      ...userData,
      firstName: data.firstName || userData.firstName,
      lastName: data.lastName || userData.lastName,
      phone: data.phone || userData.phone || '',
      address: data.address || userData.address || ''
    };

    // Update current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

    // Create updated profile data
    const profile: ProfileData = {
      id: updatedUserData.id,
      username: updatedUserData.email.split('@')[0],
      email: updatedUserData.email,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      phone: updatedUserData.phone || '',
      address: typeof updatedUserData.address === 'string' ? updatedUserData.address : (updatedUserData.address ? `${updatedUserData.address.street || ''}, ${updatedUserData.address.city || ''}, ${updatedUserData.address.state || ''} ${updatedUserData.address.zip || ''}`.trim() : ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      message: 'Profile updated successfully',
      profile
    };
  }
}

export const profileService = new ProfileService();
export type { ProfileData, UserStats, UpdateProfileData };
