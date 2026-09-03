import { apiClient } from './apiClient';

/**
 * Get Google OAuth authorization URL.
 */
export async function getGoogleAuthUrl() {
  try {
    const response = await apiClient.get('/google/auth-url');
    return response.url;
  } catch (err) {
    console.error('[googleService.getGoogleAuthUrl] Error:', err);
    throw err;
  }
}

/**
 * Check if the current user has authorized Google Calendar & Tasks.
 */
export async function getGoogleStatus() {
  try {
    const response = await apiClient.get('/google/status');
    return response.connected;
  } catch (err) {
    console.error('[googleService.getGoogleStatus] Error:', err);
    return false;
  }
}

/**
 * Exchange OAuth callback authorization code for tokens.
 */
export async function handleGoogleCallback(code) {
  try {
    const response = await apiClient.post('/google/callback', { code });
    return response;
  } catch (err) {
    console.error('[googleService.handleGoogleCallback] Error:', err);
    throw err;
  }
}

/**
 * Save ingredient shopping availability and sync NOT_AVAILABLE items to Google Calendar & Tasks.
 */
export async function syncShoppingList(planId, date, shoppingItems) {
  try {
    const response = await apiClient.post('/google/sync-shopping', {
      planId,
      date,
      shoppingItems,
    });
    return response;
  } catch (err) {
    console.error('[googleService.syncShoppingList] Error:', err);
    throw err;
  }
}
