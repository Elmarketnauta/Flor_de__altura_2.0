/**
 * Authentication helper - does NOT import auth() to avoid circular dependencies
 * Simply returns null during build time
 */
export async function getAuthUser() {
  // During build time, return null to prevent errors
  // During runtime, call auth() directly in pages/components that need it
  if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
    return null;
  }
  return null;
}

/**
 * Check if running in build time (prevent calling async auth)
 */
export function isBuildTime(): boolean {
  return process.env.__NEXT_PAGE__ !== undefined || process.env.npm_lifecycle_event === "build";
}
