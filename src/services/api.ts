const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Add auth header when needed
      ...(localStorage.getItem('authToken') ? {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      } : {}),
    },
    ...options
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return response.json();
}