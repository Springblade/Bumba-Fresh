import { useAuth } from '../context/AuthContext';

/* 
 * CHANGE: Created admin authentication hook
 * DATE: 21-06-2025
 */
export type AdminPermission = 
  | 'manage-meals'
  | 'manage-orders'
  | 'manage-customers'
  | 'manage-subscriptions'
  | 'manage-settings'
  | 'manage-admins';

export function useAdminAuth() {
  const { user } = useAuth();
  
  // Check if user has admin role
  const isAdmin = Boolean(user?.isAdmin);
  
  /**
   * Checks if the current user has a specific admin permission
   * @param permission - The permission to check for
   * @returns boolean indicating if the user has the specified permission
   */
  const hasPermission = (_permission: AdminPermission): boolean => {
    // Add underscore prefix to indicate intentionally unused parameter
    if (!isAdmin) return false;
    
    // In a production app, we would check if the user has the specific permission
    // For now, all admin users have all permissions
    return true;
  };

  return {
    isAdmin,
    hasPermission,
    user
  };
}