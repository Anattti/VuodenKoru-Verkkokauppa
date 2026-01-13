import { NextResponse, NextRequest } from 'next/server';
import { clearSession } from '@/lib/shopify/auth';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
    // Tyhjennetään vanhentunut sessio
    await clearSession();

    // Ohjataan takaisin login-sivulle virheviestillä käyttäen nykyistä originia
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/account/login?error=stale_session`);
}
