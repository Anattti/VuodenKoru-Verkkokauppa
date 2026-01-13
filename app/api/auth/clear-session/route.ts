import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CUSTOMER_SESSION_COOKIE = 'shopify_customer_session';

export async function GET() {
    // Tyhjennetään vanhentunut sessio
    const cookieStore = await cookies();
    cookieStore.delete(CUSTOMER_SESSION_COOKIE);

    // Ohjataan takaisin login-sivulle virheviestillä
    return NextResponse.redirect(new URL('/account/login?error=stale_session', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
