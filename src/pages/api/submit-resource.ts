import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { resources } from '../../lib/schema';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const conditionSlug = formData.get('conditionSlug') as string | null;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const submitterName = formData.get('submitterName') as string;
    const submitterEmail = formData.get('submitterEmail') as string;

    if (!title || !url || !category || !description || !submitterName || !submitterEmail) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be filled out' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitterEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(resources).values({
      title,
      url,
      conditionSlug: conditionSlug || null,
      category,
      description,
      submitterName,
      submitterEmail,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Resource submitted for review. Thank you!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Resource submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit resource. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
