import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    /*
    // NOTE: disabling the onboarding separate page as it is inside the main page as Dialog for now
    if (req.nextUrl.pathname.startsWith('/onboarding') && isAuthenticated && token.is_onboarded) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (!req.nextUrl.pathname.startsWith('/onboarding') && isAuthenticated && !token.is_onboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
    */
  },
  {
    pages: {
      signIn: '/auth/login',
    },
  },
);

export const config = {
  // Matches all paths except those explicitly excluded
  matcher: [
    '/((?!api/auth|auth|images|icon|test|health|sitemap.xml|robots.txt|opengraph-image.png|twitter-image.png|discount).*)(.+)',
  ],
};
