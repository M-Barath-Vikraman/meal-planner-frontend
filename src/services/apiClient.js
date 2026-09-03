/**
 * @file apiClient.js
 * Centralized API client wrapper using standard Fetch API.
 * 
 * Configured with relative `/api` base URL for Vite proxy in development
 * and single Express server origin in production.
 */

import { fetchAuthSession } from 'aws-amplify/auth';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom Error class for API response errors.
 */
export class ApiError extends Error {
  constructor(message, statusCode, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Base HTTP request handler.
 * @param {string} endpoint - Relative path (e.g. '/foods', '/plans')
 * @param {RequestInit} [options] 
 * @returns {Promise<any>} Response JSON data
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let authHeader = {};
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    // No active token available
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...authHeader,
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON if response has content
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const errorCode = data?.error?.code || 'HTTP_ERROR';
      throw new ApiError(errorMessage, response.status, errorCode, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    console.error(`[ApiClient Error] ${options.method || 'GET'} ${url}:`, err);
    throw new ApiError(err.message || 'Network request failed', 0, 'NETWORK_ERROR');
  }
}

export const apiClient = {
  /**
   * Send GET request.
   * @param {string} endpoint 
   * @param {Record<string, string|number>} [params] 
   */
  get(endpoint, params) {
    let queryString = '';
    if (params) {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          search.append(key, String(val));
        }
      });
      const qs = search.toString();
      if (qs) queryString = `?${qs}`;
    }
    return request(`${endpoint}${queryString}`, { method: 'GET' });
  },

  /**
   * Send POST request.
   * @param {string} endpoint 
   * @param {any} body 
   */
  post(endpoint, body) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Send PUT request.
   * @param {string} endpoint 
   * @param {any} body 
   */
  put(endpoint, body) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Send PATCH request.
   * @param {string} endpoint 
   * @param {any} body 
   */
  patch(endpoint, body) {
    return request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Send DELETE request.
   * @param {string} endpoint 
   */
  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' });
  },
};
