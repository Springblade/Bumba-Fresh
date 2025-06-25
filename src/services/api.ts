const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('authToken');
  const url = `${API_URL}${endpoint}`;
  
  console.log('🌐 API Request:', { 
    url, 
    endpoint, 
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    method: options?.method || 'GET',
    body: options?.body ? 'Present' : 'None'
  });
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {
        'Authorization': `Bearer ${token}`
      } : {}),
      ...(options?.headers || {})
    },
    ...options
  });
  
  console.log('📡 API Response:', { 
    status: response.status, 
    statusText: response.statusText,
    ok: response.ok,
    url: response.url
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('❌ API Error Response:', error);
    
    // Handle specific error cases
    if (response.status === 401) {
      // Clear auth token if unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Authentication failed. Please log in again.');
    }
    
    // For validation errors, create a custom error with details
    if (response.status === 400 && error.details) {
      const validationError = new Error(error.error || 'Validation failed');
      (validationError as any).details = error.details;
      (validationError as any).isValidationError = true;
      console.error('Validation Error Details:', error.details); // Better debugging for validation errors
      throw validationError;
    }
    
    throw new Error(error.message || error.error || `API error: ${response.status}`);
  }
  
  return response.json();
}