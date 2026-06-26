import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

let BASE_URL = 'http://localhost:1234'; // Default for web
if (Platform.OS === 'android') {
  BASE_URL = 'http://10.0.2.2:1234';
} else if (Platform.OS === 'ios') {
  BASE_URL = 'http://10.0.0.3:1234'; // Local IP for stability
}

/**
 * Retrieves the stored JWT token from AsyncStorage.
 * @returns {Promise<string|null>} The token string, or null if not found.
 */
async function getToken() {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch {
    return null;
  }
}

/**
 * Retrieves the stored user object from AsyncStorage.
 */
async function getUser() {
  try {
    const userStr = await AsyncStorage.getItem('authUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Builds the default headers for every API request.
 * Automatically attaches the Authorization header with the Bearer token
 * if one exists in AsyncStorage.
 * @param {object} [extra] - Additional headers to merge.
 * @returns {Promise<object>} The merged headers object.
 */
async function buildHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...extra,
  };

  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const user = await getUser();
  if (user && user.id) {
    headers['X-User-Id'] = user.id;
  }

  return headers;
}

/**
 * Core request helper. Sends an HTTP request and returns the parsed response.
 * Throws an error with the server's error message on non-2xx responses.
 *
 * @param {string} endpoint - The API path (e.g. '/api/users').
 * @param {object} options  - Fetch options (method, body, headers, etc.).
 * @returns {Promise<object>} Parsed JSON response body (or empty object for 201/204).
 */
async function request(endpoint, options = {}) {
  const { body, headers: extraHeaders, ...rest } = options;

  const headers = await buildHeaders(extraHeaders);

  const config = {
    ...rest,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // For 204 No Content or 201 Created with no body, return an empty result
  if (response.status === 204 || (response.status === 201 && response.headers.get('content-length') === '0')) {
    return { _status: response.status, _headers: response.headers };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Convenience Methods ───────────────────────────────────────────────────────

/**
 * Sends a GET request to the given endpoint.
 * @param {string} endpoint - API path.
 * @param {object} [options] - Additional fetch options.
 */
export function get(endpoint, options = {}) {
  return request(endpoint, { method: 'GET', ...options });
}

/**
 * Sends a POST request with a JSON body.
 * @param {string} endpoint - API path.
 * @param {object} body     - Request payload.
 * @param {object} [options] - Additional fetch options.
 */
export function post(endpoint, body, options = {}) {
  return request(endpoint, { method: 'POST', body, ...options });
}

/**
 * Sends a PATCH request with a JSON body.
 * @param {string} endpoint - API path.
 * @param {object} body     - Request payload.
 * @param {object} [options] - Additional fetch options.
 */
export function patch(endpoint, body, options = {}) {
  return request(endpoint, { method: 'PATCH', body, ...options });
}

/**
 * Sends a DELETE request to the given endpoint.
 * @param {string} endpoint - API path.
 * @param {object} [options] - Additional fetch options.
 */
export function del(endpoint, options = {}) {
  return request(endpoint, { method: 'DELETE', ...options });
}

export default { get, post, patch, del, BASE_URL };
