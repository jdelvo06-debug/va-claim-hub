import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { subscribers } from '../../../lib/schema';
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
    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.subscribedAt));

    return new Response(JSON.stringify(allSubscribers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin subscribers fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
