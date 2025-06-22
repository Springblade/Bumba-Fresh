import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const ProfileSettings = () => {
  const {
    user
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    setIsEditing(false);
  };
  return <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Settings
          </h2>
          <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-medium text-primary-600 hover:text-primary-700">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        {isEditing ? <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" value={formData.firstName} onChange={e => setFormData({
              ...formData,
              firstName: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" value={formData.lastName} onChange={e => setFormData({
              ...formData,
              lastName: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" disabled />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed for security reasons.
              </p>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                Save Changes
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
            </div>
          </div>}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Admin Access</h3>
        <p className="text-sm text-gray-500 mt-1">
          If you have an admin key, you can activate admin features.
        </p>
        <div className="mt-4">
          <Link 
            to="/account/admin-setup"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Shield className="mr-2 h-5 w-5 text-gray-500" />
            Admin Setup
          </Link>
        </div>
      </div>
    </div>;
};