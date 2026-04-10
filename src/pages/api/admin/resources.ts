import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { resources } from '../../../lib/schema';
import { desc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const adminToken = cookies.get('admin_token')?.value;
  if (adminToken !== import.meta.env.ADMIN_SECRET) {
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
