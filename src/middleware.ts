import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Decode JWT payload (without verification)
function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isApiRequest = path.startsWith('/api')

  // Allow static assets (images/icons) without auth so logos and hero images load for all users
  const isStaticAsset =
    path.startsWith('/assets/') ||
    /\.(png|jpe?g|gif|svg|ico|webp)$/i.test(path)

  if (isStaticAsset) {
    return NextResponse.next()
  }

  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/verify-otp',
    '/features',
    '/how-it-works',
    '/pricing',
    '/contact',
    '/support',
    '/search',
    '/faq',
    '/terms',
    '/privacy',
    '/admin/login',
    '/cards/public/*',
    '/api/message/receive',
    '/api/message/send'
  ]
  
  const isAuthPath = path.startsWith('/auth')
  const isAdminPath = path.startsWith('/admin')
  const isDashboardPath = path.startsWith('/dashboard')
  const isPricingPath = path === '/pricing' || path.startsWith('/pricing/')
  const isContactPath = path === '/contact' || path.startsWith('/contact/')
  const isDashboardContactPath = path === '/dashboardcontact' || path.startsWith('/dashboardcontact/')

  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath.endsWith('*')) {
      return path.startsWith(publicPath.slice(0, -1))
    }
    return publicPath === path
  }) || isPricingPath || isContactPath || isDashboardContactPath

  const userToken = request.cookies.get('user_token')?.value
  const adminToken = request.cookies.get('admin_token')?.value
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length).trim()
    : undefined
  
  const hasUserToken = request.cookies.has('user_token')
  const hasAdminToken = request.cookies.has('admin_token')

  let userId: string | null = null
  let adminId: string | null = null
  
  if (userToken) {
    const decoded = decodeJwtPayload(userToken)
    if (decoded) {
      userId = decoded.userId || decoded.id || null
    }
  }

  if (adminToken) {
    const decoded = decodeJwtPayload(adminToken)
    if (decoded) {
      adminId = decoded.adminId || decoded.id || null
    }
  }

  if (!userId && bearerToken) {
    const decoded = decodeJwtPayload(bearerToken)
    if (decoded) {
      userId = decoded.userId || decoded.id || null
    }
  }

  // Handle preflight OPTIONS requests for CORS
  if (request.method === 'OPTIONS' && isApiRequest) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-CSRF-Token, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Add user/admin IDs to headers
  const requestHeaders = new Headers(request.headers)
  if (userId !== null) {
    requestHeaders.set('x-user-id', userId)
  }
  if (adminId !== null) {
    requestHeaders.set('x-admin-id', adminId)
  }

  // Add CORS headers to response for API requests
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  if (isApiRequest) {
    const origin = request.headers.get('origin')
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  }

  // Redirect logic
  if (!isApiRequest) {
    // Always allow auth pages and explicit public pages
    if (isAuthPath || isPublicPath) {
      return response
    }

    // Admin routes require admin token
    if (isAdminPath) {
      if (!hasAdminToken) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return response
    }

    // Dashboard and other non-public app pages require user token
    if (!hasUserToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*?)'],
}