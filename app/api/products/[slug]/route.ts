import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
    const { slug } = await params;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}&select=*`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        const data = await response.json();

        if (data.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Params }) {
    const { slug } = await params;

    try {
        const body = await request.json();

        const updateData = {
            title: body.title,
            subtitle: body.subtitle,
            hero_icon: body.hero_icon,
            store_url: body.store_url,
            secondary_url: body.secondary_url,
            secondary_url_label: body.secondary_url_label,
            features: body.features,
            packages: body.packages,
            extra_section_title: body.extra_section_title,
            extra_section_description: body.extra_section_description,
            extra_section_items: body.extra_section_items,
            cta_title: body.cta_title,
            cta_description: body.cta_description,
            meta_description: body.meta_description,
            updated_at: new Date().toISOString()
        };

        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}`, {
            method: 'PATCH',
            headers: {
                apikey: SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        const data = await response.json();
        return NextResponse.json(data[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
