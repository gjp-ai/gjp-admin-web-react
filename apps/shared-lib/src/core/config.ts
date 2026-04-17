/**
 * Environment configuration for GJP AI Admin Console
 */

export const APP_ENV = {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE ?? 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
};

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Admin Console',
  APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  COPYRIGHT: `© ${new Date().getFullYear()} GANJIANPING All Rights Reserved`,
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'en',
  AVAILABLE_LANGUAGES: import.meta.env.VITE_AVAILABLE_LANGUAGES?.split(',') ?? ['en', 'zh'],
  DEFAULT_PAGE_TITLE: import.meta.env.VITE_DEFAULT_PAGE_TITLE ?? 'Dashboard',
  DEFAULT_PAGE_TITLE_KEY: 'navigation.dashboard', // Internal i18n key - not configurable
  TOKEN: {
    ACCESS_TOKEN_KEY: 'gjp_access_token',
    REFRESH_TOKEN_KEY: 'gjp_refresh_token',
    TOKEN_TYPE_KEY: 'gjp_token_type',
  },
  THEME: {
    DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME ?? 'light',
    DEFAULT_COLOR_THEME: import.meta.env.VITE_DEFAULT_COLOR_THEME ?? 'blue',
    STORAGE_KEY: 'gjp_theme',
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/auth/login',
    DASHBOARD: '/dashboard',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
  },
  AUTH: {
    LOGIN_URL: import.meta.env.VITE_AUTH_LOGIN_URL ?? '/v1/auth/tokens',
    REFRESH_TOKEN_URL: import.meta.env.VITE_AUTH_REFRESH_TOKEN_URL ?? '/v1/auth/tokens',
    TOKEN_EXPIRY_BUFFER: parseInt(import.meta.env.VITE_AUTH_TOKEN_EXPIRY_BUFFER ?? '300'),
    IDLE_TIMEOUT_MINUTES: parseInt(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES ?? '15'),
    IDLE_WARNING_MINUTES: parseInt(import.meta.env.VITE_IDLE_WARNING_MINUTES ?? '2'),
  },
};

export default { APP_ENV, APP_CONFIG };
