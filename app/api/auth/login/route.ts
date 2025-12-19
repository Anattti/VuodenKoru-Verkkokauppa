import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLoginUrl } from '@/lib/shopify/auth';

export async function GET() {
    try {
        const { url, state, nonce, codeVerifier } = await getLoginUrl();

        const cookieStore = await cookies();
        const isProd = process.env.NODE_ENV === 'production';

        cookieStore.set('shopify_auth_state', state, {
            httpOnly: true,
            secure: isProd,
            maxAge: 3600,
            path: '/'
        });
        cookieStore.set('shopify_auth_nonce', nonce, {
            httpOnly: true,
            secure: isProd,
            maxAge: 3600,
            path: '/'
        });
        cookieStore.set('shopify_auth_code_verifier', codeVerifier, {
            httpOnly: true,
            secure: isProd,
            maxAge: 3600,
            path: '/'
        });

        return NextResponse.redirect(url);
    } catch (error) {
        console.error('Login initiation failed:', error);
        return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
    }
}
