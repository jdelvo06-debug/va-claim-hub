import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { contacts } from '../../../lib/schema';
import { desc } from 'drizzle-orm';
import { isAdminAuthorized } from '../../../lib/admin-auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAdminAuthorized(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const allContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));

    return new Response(JSON.stringify(allContacts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin contacts fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
