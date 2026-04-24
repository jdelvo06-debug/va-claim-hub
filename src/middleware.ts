import { defineMiddleware } from 'astro:middleware';
import { checkLoginRateLimit } from './lib/rate-limit';

export const onRequest = defineMiddleware(async (context, next) => {
  // Rate-limit POST attempts to the admin login page
  if (
    context.url.pathname.startsWith('/admin/login') &&
    context.request.method === 'POST'
  ) {
    const ip =
      context.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      context.request.headers.get('x-real-ip') ??
      'unknown';

    const { allowed, retryAfterSeconds } = checkLoginRateLimit(ip);

    if (!allowed) {
      const waitDisplay =
        retryAfterSeconds < 60
          ? `${retryAfterSeconds} second(s)`
          : `${Math.ceil(retryAfterSeconds / 60)} minute(s)`;
      return new Response(
        `Too many login attempts. Try again in ${waitDisplay}.`,
        {
          status: 429,
          headers: {
            'Content-Type': 'text/plain',
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }
  }

  // Protect admin routes (except login)
  if (
    context.url.pathname.startsWith('/admin') &&
    !context.url.pathname.startsWith('/admin/login')
  ) {
    const adminToken = context.cookies.get('admin_token')?.value;
    if (adminToken !== import.meta.env.ADMIN_SECRET) {
      return context.redirect('/admin/login');
    }
  }

  const response = await next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
});
