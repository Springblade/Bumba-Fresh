import React, { useMemo } from 'react';
import { CreditCard as CreditCardIcon, Package as PackageIcon, RefreshCw as RefreshCwIcon } from 'lucide-react';
export const AccountDashboard = () => {
  const statsData = useMemo(() => [{
    label: 'Active Orders',
    value: '2',
    icon: PackageIcon,
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600'
  }, {
    label: 'Subscription Status',
    value: 'Active',
    icon: RefreshCwIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  }, {
    label: 'Next Billing',
    value: 'Mar 1, 2024',
    icon: CreditCardIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  }], []);
  return <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here's a quick overview of your account.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};