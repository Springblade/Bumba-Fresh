import React, { useState } from 'react';
import { Save, Lock, Bell, Globe, Users, Mail } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';

/* 
 * CHANGE: Created admin settings page with configuration sections
 * DATE: 21-06-2025
 */
const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { stats } = useAdminData();

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Globe },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email', name: 'Email Templates', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Settings</h2>
            </div>
            <div className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'email' && <EmailTemplates />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Components
const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            defaultValue="Bumba Fresh"
          />
        </div>
        
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            defaultValue="contact@bumbafresh.com"
          />
        </div>
        
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Default Timezone
          </label>
          <select
            id="timezone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            defaultValue="America/New_York"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="maintenanceMode" className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Maintenance Mode</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">When enabled, only administrators can access the site.</p>
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@bumbafresh.com', role: 'Admin' },
    { id: 2, name: 'Support Staff', email: 'support@bumbafresh.com', role: 'Support' },
    { id: 3, name: 'Content Manager', email: 'content@bumbafresh.com', role: 'Editor' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">User Management</h2>
      
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm">
          Add New User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                  <button className="text-gray-600 hover:text-gray-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">Security Settings</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-2">Password Requirements</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Require minimum length (8 characters)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Require at least one uppercase letter</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Require at least one number</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Require at least one special character</span>
            </label>
          </div>
        </div>
        
        <div className="pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-2">Session Management</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                defaultValue="60"
              />
            </div>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Enforce single session per user</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">Notification Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Order Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">New order notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Order status change notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Payment failed notifications</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Customer Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">New customer registrations</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Subscription sign-ups</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Customer support requests</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Notification Methods</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Email notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Dashboard notifications</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailTemplates: React.FC = () => {
  const templates = [
    { id: 'order-confirmation', name: 'Order Confirmation' },
    { id: 'welcome-email', name: 'Welcome Email' },
    { id: 'password-reset', name: 'Password Reset' },
    { id: 'subscription-renewal', name: 'Subscription Renewal' },
    { id: 'delivery-notification', name: 'Delivery Notification' }
  ];
  
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-3">Email Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Template</h3>
          <div className="space-y-1">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full px-3 py-2 text-left text-sm rounded-md ${
                  selectedTemplate === template.id 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              Edit Template: {templates.find(t => t.id === selectedTemplate)?.name}
            </h3>
            <div>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 mr-2">
                Preview
              </button>
              <button className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">
                Save Template
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="emailSubject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                defaultValue="Your Bumba Fresh Order Confirmation"
              />
            </div>
            
            <div>
              <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700 mb-1">
                Email Body
              </label>
              <textarea
                id="emailBody"
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                defaultValue={`Hello {{customer.firstName}},\n\nThank you for your order with Bumba Fresh!\n\nOrder #: {{order.id}}\nOrder Date: {{order.date}}\nTotal: {{order.total}}\n\nYour meals will be delivered on {{order.deliveryDate}}.\n\nThank you for choosing Bumba Fresh!\n\nThe Bumba Fresh Team`}
              />
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Available Variables:</p>
              <div className="flex flex-wrap gap-2">
                {['{{customer.firstName}}', '{{customer.lastName}}', '{{order.id}}', '{{order.date}}', '{{order.total}}', '{{order.deliveryDate}}'].map(variable => (
                  <span key={variable} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;