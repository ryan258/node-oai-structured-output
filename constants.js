/**
 * Application constants - centralized configuration values.
 *
 * These constants replace magic numbers scattered throughout the codebase.
 * Update these values here rather than searching through individual files.
 */

// Server configuration
export const DEFAULT_PORT = 4000;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// Input validation
export const MAX_TOPIC_LENGTH = 500;

// Authentication
export const AUTH_HEADER_NAME = 'x-admin-key';

// Scenario generation
export const MIN_SCENARIOS = 3;
export const MAX_SCENARIOS = 5;

// Demo mode
export const DEMO_ERROR_RETRY_DELAY_MS = 1000;

// Graceful shutdown
export const SHUTDOWN_TIMEOUT_MS = 5000;
