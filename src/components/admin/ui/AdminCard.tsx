import React from 'react';

/* 
 * CHANGE: Created reusable admin card component
 * DATE: 21-06-2025
 */
interface AdminCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  children, 
  className = '',
  action
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;