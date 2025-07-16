// middleware.js (final version)
import { NextResponse } from 'next/server';
import { invalidateCache, invalidateCachePattern } from '@/lib/redis';

export async function middleware(request) {
  const { pathname, method } = request.nextUrl;

  // Only handle cache invalidation for mutating operations on all API routes
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE'].includes(method)) {
    try {
      // Invalidate specific patterns based on the path
      const pathParts = pathname.split('/');
      const basePath = pathParts.slice(0, -1).join('/');
      
      // Invalidate specific resource
      await invalidateCache(`GET:${pathname}`);
      await invalidateCache(`GET:${pathname}?*`);
      
      // Invalidate list endpoint
      await invalidateCache(`GET:${basePath}`);
      await invalidateCache(`GET:${basePath}?*`);
      
      // For dynamic routes with IDs, also invalidate the collection
      if (pathname.match(/\/\d+$/)) {
        await invalidateCachePattern(`GET:${basePath}*`);
      }
      
      console.log(`Cache invalidation triggered for ${method} ${pathname}`);
    } catch (error) {
      console.error('Middleware cache invalidation error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};