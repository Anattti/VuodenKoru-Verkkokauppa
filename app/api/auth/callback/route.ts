import { NextRequest, NextResponse } from 'next/server';
import { handleCallback } from '@/lib/shopify/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    try {
        await handleCallback(code, state);

        // Redirect to the account page after successful login
        const origin = request.nextUrl.origin;
        return NextResponse.redirect(`${origin}/account`);
    } catch (error: any) {
        console.error('Auth callback error:', error);
        const origin = request.nextUrl.origin;
        return NextResponse.redirect(`${origin}/account/login?error=auth_failed`);
    }
}
