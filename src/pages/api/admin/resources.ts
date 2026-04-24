import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { resources } from '../../../lib/schema';
import { desc, eq } from 'drizzle-orm';

export const prerender = false;

function isAuthorized(cookies: Parameters<APIRoute>[0]['cookies']): boolean {
  return cookies.get('admin_token')?.value === import.meta.env.ADMIN_SECRET;
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthorized(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const allResources = await db
      .select()
      .from(resources)
      .orderBy(desc(resources.createdAt));

    return new Response(JSON.stringify(allResources), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin resources fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resources' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ cookies, request }) => {
  if (!isAuthorized(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id: unknown; status: unknown };

    if (typeof id !== 'number' || !Number.isInteger(id)) {
      return new Response(JSON.stringify({ error: 'Invalid resource id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (status !== 'approved' && status !== 'rejected') {
      return new Response(JSON.stringify({ error: 'Status must be "approved" or "rejected"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.update(resources).set({ status }).where(eq(resources.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin resource update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update resource' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
