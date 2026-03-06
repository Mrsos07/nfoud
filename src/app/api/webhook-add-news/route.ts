import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WEBHOOK_TOKEN = process.env.WEBHOOK_SECRET_TOKEN || '2080db46-34ae-40f6-bd22-1b88ca0bffa8';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 120)
    + '-' + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    const newsData = {
      title: body.title,
      content: body.content,
      slug: body.slug || generateSlug(body.title),
      excerpt: body.excerpt || null,
      image_url: body.image_url || null,
      category: body.category || 'local',
      keywords: body.keywords || null,
      meta_description: body.meta_description || body.excerpt || null,
      canonical_url: body.canonical_url || null,
      key_points: body.key_points || null,
      editor_id: body.editor_id || null,
      location: body.location || null,
    };

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert(newsData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to insert news', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'News article created successfully',
      data: {
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        created_at: data.created_at,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhook-add-news',
    method: 'POST',
    auth: 'Bearer token required',
  });
}
