import { User } from '../types/shared';

export const AUTH_TOKEN_KEY = 'authToken';
export const USER_KEY = 'currentUser';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  removeAuthToken();
  localStorage.removeItem(USER_KEY);
}

