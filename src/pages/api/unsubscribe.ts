import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { subscribers } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/unsubscribe?error=missing' },
    });
  }

  try {
    const rows = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.unsubscribeToken, token));

    if (rows.length === 0) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/unsubscribe?error=invalid' },
      });
    }

    await db
      .delete(subscribers)
      .where(eq(subscribers.unsubscribeToken, token));

    return new Response(null, {
      status: 302,
      headers: { Location: '/unsubscribe?success=1' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(null, {
      status: 302,
      headers: { Location: '/unsubscribe?error=server' },
    });
  }
};
