import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define role-based routes from Sidebar's roleBasedNavItems
const roleBasedRoutes = {
  PATIENT: [
    '/', '/telemedicine', '/appointments', '/medical-records', '/test-results', '/prescriptions', '/billing'
  ],
  DOCTOR: [
    '/', '/telemedicine', '/patients', '/appointments', '/clinical', '/operation-theatre', '/lab-results', '/prescriptions'
  ],
  NURSE: [
    '/', '/patients', '/appointments', '/nursing', '/maternity', '/vaccination', '/medication'
  ],
  LAB_TECHNICIAN: [
    '/', '/laboratory', '/test-results', '/sample-tracking'
  ],
  PHARMACIST: [
    '/', '/pharmacy', '/dispensary', '/pharmacy-inventory', '/prescriptions'
  ],
  RECEPTIONIST: [
    '/', '/appointments', '/patient-registration', '/queue-mgmt', '/helpdesk'
  ],
  RADIOLOGIST: [
    '/', '/radiology', '/imaging-reports', '/scan-schedule'
  ],
  SURGEON: [
    '/', '/patients', '/operation-theatre', '/surgery-schedule', '/post-op-care'
  ],
  ADMIN: [
    '/', '/patients', '/doctors', '/appointments', '/adt', '/emergency', '/queue-mgmt', '/clinical',
    '/laboratory', '/radiology', '/operation-theatre', '/clinical-settings', '/cssd', '/nursing',
    '/maternity', '/vaccination', '/pharmacy', '/dispensary', '/billing', '/accounting',
    '/claim-mgmt', '/nhif', '/incentive', '/inventory', '/procurement', '/substore',
    '/fixed-assets', '/reports', '/dynamic-report', '/medical-records', '/helpdesk',
    '/mkt-referral', '/social-service', '/departments', '/settings', '/system-admin',
    '/utilities', '/verification'
  ],
  STAFF: [
    '/', '/helpdesk', '/inventory', '/procurement', '/maintenance'
  ],
  ACCOUNTANT: [
    '/', '/accounting', '/billing', '/financial-reports', '/payments'
  ],
  BILLING_OFFICER: [
    '/', '/billing', '/claim-mgmt', '/nhif', '/payments'
  ],
  HOSPITAL_MANAGER: [
    '/', '/analytics', '/reports', '/departments', '/performance', '/settings'
  ],
  IT_SUPPORT: [
    '/', '/system-admin', '/utilities', '/network', '/backups'
  ],
  CLEANING_STAFF: [
    '/', '/cssd', '/cleaning-schedules', '/cleaning-supplies'
  ],
  SECURITY: [
    '/', '/security', '/visitor-log', '/incident-reports'
  ],
  GUEST: [
    '/', '/auth', '/contact', '/about'
  ]
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const user = req.nextauth.token;

    // Allow access to public routes
    const publicRoutes = ['/auth', '/contact', '/about', '/api/auth', '/api/register'];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to /auth
    if (!user) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Check role-based access
    const allowedRoutes = roleBasedRoutes[user.role] || roleBasedRoutes.GUEST;
    const isAuthorized = allowedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};