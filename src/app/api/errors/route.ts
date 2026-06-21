import { NextRequest, NextResponse } from 'next/server'

interface ErrorLog {
  timestamp: string
  message: string
  stack?: string
  context?: Record<string, any>
  level: 'error' | 'warning' | 'info'
  url: string
  userAgent: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ErrorLog

    // TODO: In production, store these in a database or send to monitoring service
    // For now, just log them
    console.error('[Client Error]', {
      timestamp: body.timestamp,
      message: body.message,
      level: body.level,
      url: body.url,
      stack: body.stack,
      context: body.context,
    })

    // Could integrate with:
    // - Sentry: https://sentry.io
    // - LogRocket: https://logrocket.com
    // - Custom monitoring dashboard
    // - Email notifications

    return NextResponse.json(
      { success: true, received: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ErrorAPI Error]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    )
  }
}
