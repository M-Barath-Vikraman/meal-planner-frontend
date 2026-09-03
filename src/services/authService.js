/**
 * @file authService.js
 * Service module for user authentication.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Migrate these mock authentication methods to call `apiClient.get('/auth/me')` and AWS Cognito User Pools SDK.
 */

import { INITIAL_USER } from '../data/initialMockData';

const AUTH_STORAGE_KEY = 'smartmeal_auth_user';

/**
 * Simulates logging in with Google OAuth.
 * @returns {Promise<{ id: string, name: string, email: string, avatarUrl: string }>} User object
 */
export async function loginWithGoogle() {
  // Simulate network latency for API call
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const user = { ...INITIAL_USER };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}

/**
 * Logs out the current user by clearing session storage.
 * @returns {Promise<boolean>}
 */
export async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  localStorage.removeItem(AUTH_STORAGE_KEY);
  return true;
}

/**
 * Gets the current authenticated user from storage.
 * @returns {{ id: string, name: string, email: string, avatarUrl: string } | null}
 */
export function getCurrentUser() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error parsing stored user:', err);
    return null;
  }
}

/**
 * Checks if user is currently authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}
