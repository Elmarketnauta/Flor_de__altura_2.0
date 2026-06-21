/**
 * Error Tracking & Monitoring
 * Lightweight error capture without external dependencies
 * For production, integrate with Sentry or custom backend
 * Set NEXT_PUBLIC_MONITORING_ENABLED=true in .env.local
 */

interface ErrorLog {
  timestamp: string
  message: string
  stack?: string
  context?: Record<string, any>
  level: 'error' | 'warning' | 'info'
  url: string
  userAgent: string
}

const ERROR_LOGS: ErrorLog[] = []
const MAX_LOGS = 50

export function initErrorTracking() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_MONITORING_ENABLED) return

  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    captureException(event.error, {
      source: 'global-error-handler',
    })
  })

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason, {
      source: 'unhandled-rejection',
    })
  })

  console.log('[ErrorTracking] Initialized')
}

export function captureException(error: Error | string, context?: Record<string, any>) {
  if (typeof window === 'undefined') return

  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    message,
    stack,
    context,
    level: 'error',
    url: window.location.href,
    userAgent: navigator.userAgent,
  }

  ERROR_LOGS.push(log)
  if (ERROR_LOGS.length > MAX_LOGS) {
    ERROR_LOGS.shift()
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorTracking]', log)
  }

  // Send to backend endpoint if configured
  if (process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true') {
    navigator.sendBeacon('/api/errors', JSON.stringify(log))
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window === 'undefined') return

  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    message,
    level,
    url: window.location.href,
    userAgent: navigator.userAgent,
  }

  ERROR_LOGS.push(log)
  if (ERROR_LOGS.length > MAX_LOGS) {
    ERROR_LOGS.shift()
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[ErrorTracking:${level}]`, message)
  }
}

export function getErrorLogs(): ErrorLog[] {
  return [...ERROR_LOGS]
}

export function clearErrorLogs() {
  ERROR_LOGS.length = 0
}
