const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Retrieves the authentication token from local storage.
 * @returns {string|null} The auth token.
 */
export const getToken = () => {
  return localStorage.getItem('rizla_token');
};

// Guests need a stable identifier so their cart survives page refreshes without
// requiring an account.
const getSessionId = () => {
  let sessionId = localStorage.getItem('rizla_session_id');
  if (!sessionId) {
    sessionId = globalThis.crypto?.randomUUID?.() || `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('rizla_session_id', sessionId);
  }
  return sessionId;
};

/**
 * A helper function to make authenticated API requests.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - Configuration for the fetch request.
 * @param {object} options.body - The request payload.
 * @param {object} options.customConfig - Other fetch options.
 * @returns {Promise<any>} The response data.
 */
const client = async (endpoint, { body, ...customConfig } = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    headers['X-Session-Id'] = getSessionId();
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    return Promise.reject(new Error(errorData.error || errorData.message || response.statusText));
  }

  if (response.status === 204 /* No Content */) {
    return;
  }

  return response.json();
};

export const api = {
  auth: {
    /**
     * Fetches the current authenticated user's profile.
     */
    me: () => client('/auth/me'),
    /**
     * Logs in a user.
     * @param {{email, password}} credentials - The user's credentials.
     */
    login: (credentials) => client('/auth/login', { body: credentials }),
    /**
     * Registers a new user.
     * @param {{name, email, password}} userInfo - The new user's information.
     */
    register: (userInfo) => client('/auth/register', { body: userInfo }),
  },
  cart: {
    /**
     * Fetches the user's shopping cart.
     */
    get: () => client('/cart'),
    /**
     * Adds an item to the cart.
     * @param {string} productId - The ID of the product to add.
     * @param {number} quantity - The quantity of the product.
     */
    addItem: (productId, quantity) => client('/cart/items', { body: { productId, quantity } }),
    /**
     * Updates the quantity of an item in the cart.
     * @param {string} itemId - The ID of the cart item.
     * @param {number} quantity - The new quantity.
     */
    updateItem: (itemId, quantity) => client(`/cart/items/${itemId}`, { body: { quantity }, method: 'PATCH' }),
    /**
     * Removes an item from the cart.
     * @param {string} itemId - The ID of the cart item to remove.
     */
    removeItem: (itemId) => client(`/cart/items/${itemId}`, { method: 'DELETE' }),
    /**
     * Clears all items from the cart.
     */
    clear: () => client('/cart', { method: 'DELETE' }),
  },
  products: {
    /**
     * Fetches all products.
     */
    getAll: (params = {}) => client(`/products${new URLSearchParams(params).toString() ? `?${new URLSearchParams(params)}` : ''}`),
    /**
     * Fetches a single product by its ID.
     * @param {string} productId - The ID of the product to fetch.
     */
    getById: (productId) => client(`/products/${productId}`),
    getCollections: () => client('/products/collections'),
    getCategories: () => client('/products/categories'),
  },
  wishlist: {
    get: () => client('/wishlist'),
    add: (productId) => client(`/wishlist/${productId}`, { body: {} }),
    remove: (productId) => client(`/wishlist/${productId}`, { method: 'DELETE' }),
  },
  orders: {
    create: (details) => client('/orders', { body: details }),
    getAll: () => client('/orders'),
    getById: (id) => client(`/orders/${id}`),
  },
  newsletter: { subscribe: (email) => client('/newsletter/subscribe', { body: { email } }) },
  contact: { send: (details) => client('/contact', { body: details }) },
};

export default client;
