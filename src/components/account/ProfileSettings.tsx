import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';

export const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate that first name and last name are provided
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Both first name and last name are required.');
      setIsLoading(false);
      return;
    }

    try {
      // Only send first name and last name (email is not editable)
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      };

      console.log('ProfileSettings: Updating profile with data:', updateData);
      const result = await profileService.updateUserProfile(updateData);
        // Update the user context with new data
      if (updateUserProfile) {
        updateUserProfile({
          firstName: result.profile.firstName,
          lastName: result.profile.lastName
        });
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };
  return <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Settings
          </h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Display success/error messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {isEditing ? <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={e => setFormData({
                    ...formData,
                    firstName: e.target.value
                  })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                  required
                  maxLength={100}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={e => setFormData({
                    ...formData,
                    lastName: e.target.value
                  })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                  required
                  maxLength={100}
                  placeholder="Enter your last name"
                />
              </div>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={formData.email} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300" 
                disabled 
                readOnly
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed for security reasons.
              </p>
            </div>            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form> : <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  First Name
                </label>
                <p className="text-gray-900">{user?.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Name
                </label>
                <p className="text-gray-900">{user?.lastName}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email}</p>
            </div>          </div>}
      </div>
    </div>;
};