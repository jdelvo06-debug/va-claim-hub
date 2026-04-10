import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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
