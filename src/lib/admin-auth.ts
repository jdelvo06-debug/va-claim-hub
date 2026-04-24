import type { AstroCookies } from 'astro';

export function isAdminAuthorized(cookies: AstroCookies): boolean {
  return cookies.get('admin_token')?.value === import.meta.env.ADMIN_SECRET;
}
