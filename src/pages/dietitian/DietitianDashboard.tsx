import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DietitianDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const statsConfig = [
    { 
      label: 'Client Satisfaction', 
      value: '4.9/5', 
      icon: TrendingUp, 
      change: '+0.2 this month',
      changePositive: true 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dietitian Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's an overview of your nutrition counseling activities.
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.changePositive ? 'bg-green-100' : 'bg-red-100'}`}>
                <stat.icon className={`w-6 h-6 ${stat.changePositive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        ))}      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
              <button 
                onClick={() => navigate('/dietitian/messages')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All Messages →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'John Smith', message: 'Thank you for the meal plan advice!', time: '5 min ago', unread: true },
                { name: 'Sarah Johnson', message: 'Can we schedule a follow-up consultation?', time: '1 hour ago', unread: true },
                { name: 'Michael Williams', message: 'The low-carb recommendations are working great!', time: '3 hours ago', unread: false },
              ].map((msg, i) => (
                <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg ${msg.unread ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {msg.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{msg.name}</p>
                      <p className="text-xs text-gray-500">{msg.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.message}</p>                  </div>
                  {msg.unread && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietitianDashboard;
