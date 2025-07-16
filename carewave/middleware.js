// middleware.js (updated)
import { NextResponse } from 'next/server';
import { getCachedData, invalidateCache } from '@/lib/redis';

export async function middleware(request) {
  const { pathname, method } = request.nextUrl;

  if (pathname.startsWith('/api/laboratory/')) {
    const cacheKey = `${method}:${pathname}`;
    try {
      // For GET requests, check cache
      if (method === 'GET') {
        const cachedResponse = await getCachedData(cacheKey, async () => {
          const response = await fetch(request);
          if (!response.ok) throw new Error('Non-200 response');
          return await response.json();
        });
        return NextResponse.json(cachedResponse);
      }

      // For POST, PUT, DELETE, invalidate cache and proceed
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        // Invalidate specific cache (e.g., for /api/laboratory/tests/[id])
        const basePath = pathname.split('/').slice(0, -1).join('/'); // e.g., /api/laboratory/tests
        await invalidateCache(`GET:${pathname}`); // Invalidate specific resource
        await invalidateCache(`GET:${basePath}`); // Invalidate list endpoint
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware cache error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/laboratory/:path*',
};