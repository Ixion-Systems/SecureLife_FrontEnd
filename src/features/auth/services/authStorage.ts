/**
 * Auth Storage Service
 *
 * Provides a secure, tab/session-scoped storage mechanism using sessionStorage.
 * Completely eliminates long-lived, stale persistence in localStorage in accordance
 * with banking and insurance privacy/compliance guidelines.
 *
 * @module features/auth/services/authStorage
 */

export interface StoredUser {
  id: string;
  email: string;
  role?: string;
  profile?: {
    firstName: string;
    lastName: string;
    dni: string;
    phone?: string;
  };
}

const TOKEN_KEY = 'securelife_token';
const REFRESH_TOKEN_KEY = 'securelife_refresh_token';
const USER_KEY = 'securelife_user';

export const authStorage = {
  /**
   * Retrieves the current active JWT Access Token from sessionStorage.
   */
  getToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Stores the JWT Access Token in sessionStorage.
   */
  setToken(token: string): void {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage unavailable or quota exceeded
    }
  },

  /**
   * Retrieves the Refresh Token from sessionStorage.
   */
  getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Stores the Refresh Token in sessionStorage.
   */
  setRefreshToken(refreshToken: string): void {
    try {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // Storage unavailable
    }
  },

  /**
   * Retrieves the authenticated user profile object from sessionStorage.
   */
  getUser(): StoredUser | null {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  },

  /**
   * Serializes and stores the authenticated user profile object in sessionStorage.
   */
  setUser(user: StoredUser): void {
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Storage unavailable
    }
  },

  /**
   * Clears all authentication credentials and session attributes.
   */
  clear(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch {
      // Storage unavailable
    }
  },

  /**
   * Checks whether an active access token exists.
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
