import React from 'react';

/* 
 * CHANGE: Created reusable admin page header component
 * DATE: 21-06-2025
 */
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex justify-between items-start pb-6 mb-6 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="mt-1 text-gray-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminPageHeader;