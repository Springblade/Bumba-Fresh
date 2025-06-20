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
    // For now, use mock data from localStorage since the database is not fully connected
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('No user data found');
    }

    const userData = JSON.parse(currentUser);
    const fakeUsers = JSON.parse(localStorage.getItem('fakeUsers') || '[]');
    const fullUserData = fakeUsers.find((u: any) => u.email === userData.email);

    if (!fullUserData) {
      throw new Error('User profile not found');
    }

    // Create profile data matching the interface
    const profile: ProfileData = {
      id: userData.id,
      username: fullUserData.email.split('@')[0], // Generate username from email
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: fullUserData.phone || '',
      address: fullUserData.address || '',
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
    // For now, update the localStorage data since the database is not fully connected
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('No user data found');
    }

    const userData = JSON.parse(currentUser);
    
    // Update the current user data
    const updatedUserData = {
      ...userData,
      firstName: data.firstName || userData.firstName,
      lastName: data.lastName || userData.lastName
    };

    // Update fakeUsers array
    const fakeUsers = JSON.parse(localStorage.getItem('fakeUsers') || '[]');
    const userIndex = fakeUsers.findIndex((u: any) => u.email === userData.email);
    
    if (userIndex !== -1) {
      fakeUsers[userIndex] = {
        ...fakeUsers[userIndex],
        fullName: `${updatedUserData.firstName} ${updatedUserData.lastName}`,
        phone: data.phone || fakeUsers[userIndex].phone || '',
        address: data.address || fakeUsers[userIndex].address || ''
      };
      localStorage.setItem('fakeUsers', JSON.stringify(fakeUsers));
    }

    // Update current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

    // Create updated profile data
    const profile: ProfileData = {
      id: updatedUserData.id,
      username: updatedUserData.email.split('@')[0],
      email: updatedUserData.email,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      phone: data.phone || '',
      address: data.address || '',
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
