import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as crypto from 'node:crypto';

export const dynamic = 'force-dynamic';

export const CUSTOMER_SESSION_COOKIE = 'shopify_customer_session';

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
const REDIRECT_URI = process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

export interface Session {
    accessToken: string;
    expiresAt: string;
    idToken: string;
    refreshToken?: string;
}

/**
 * Decodes a JWT token without validation (for extracting claims like nonce).
 */
function decodeJwt(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    } catch {
        return null;
    }
}

/**
 * PKCE Helpers: Creates a code verifier and challenge.
 */
function generateCodeVerifier() {
    return Buffer.from(crypto.randomBytes(32)).toString('base64url');
}

async function generateCodeChallenge(codeVerifier: string) {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return Buffer.from(hash).toString('base64url');
}

/**
 * Generates the Shopify Customer Account login URL data including PKCE params.
 */
export async function getLoginUrl() {
    if (!CLIENT_ID || !SHOP_ID) {
        throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID or SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID');
    }

    const state = Buffer.from(crypto.randomBytes(16)).toString('hex');
    const nonce = Buffer.from(crypto.randomBytes(16)).toString('hex');
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const url = new URL(`https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`);
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('scope', 'openid email customer-account-api:full');
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', state);
    url.searchParams.append('nonce', nonce);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', 'S256');

    return {
        url: url.toString(),
        state,
        nonce,
        codeVerifier
    };
}

/**
 * Exchanges the code for an access token using the PKCE code verifier.
 */
export async function handleCallback(code: string, state: string) {
    const cookieStore = await cookies();
    const savedState = cookieStore.get('shopify_auth_state')?.value;
    const savedNonce = cookieStore.get('shopify_auth_nonce')?.value;
    const codeVerifier = cookieStore.get('shopify_auth_code_verifier')?.value;

    if (!savedState || savedState !== state) {
        throw new Error('Invalid auth state');
    }

    if (!codeVerifier) {
        throw new Error('Missing code verifier');
    }

    if (!CLIENT_ID || !SHOP_ID) {
        throw new Error('Missing Shopify environment variables');
    }

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code,
        code_verifier: codeVerifier,
    });

    const response = await fetch(`https://shopify.com/authentication/${SHOP_ID}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();

    // Best Practice: Validate nonce from id_token
    const decodedIdToken = decodeJwt(data.id_token);
    if (savedNonce && decodedIdToken?.nonce !== savedNonce) {
        throw new Error('Invalid nonce in ID token');
    }

    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    const accessToken = data.access_token.startsWith('shcat_')
        ? data.access_token
        : `shcat_${data.access_token}`;

    await setSession({
        accessToken,
        expiresAt,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
    });

    // Cleanup auth cookies
    cookieStore.delete('shopify_auth_state');
    cookieStore.delete('shopify_auth_nonce');
    cookieStore.delete('shopify_auth_code_verifier');
}

/**
 * Sets the session cookie.
 */
export async function setSession(session: Session) {
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(session.expiresAt),
    });
}

/**
 * Gets the current session.
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

    if (!sessionData) return null;

    try {
        const session = JSON.parse(sessionData) as Session;

        // Check if token is expired or expiring soon (within 5 minutes)
        const expiresAt = new Date(session.expiresAt);
        const now = new Date();

        if (expiresAt <= new Date(now.getTime() + 5 * 60 * 1000)) {
            // Token expired or about to expire, try to refresh
            if (session.refreshToken) {
                const newSession = await refreshAccessToken(session.refreshToken);
                if (newSession) return newSession;
            }
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

/**
 * Refreshes the access token using a refresh token.
 */
async function refreshAccessToken(refreshToken: string): Promise<Session | null> {
    if (!CLIENT_ID || !SHOP_ID) return null;

    try {
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            refresh_token: refreshToken,
        });

        const response = await fetch(`https://shopify.com/authentication/${SHOP_ID}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

        const newSession: Session = {
            accessToken: data.access_token,
            expiresAt,
            idToken: data.id_token,
            refreshToken: data.refresh_token || refreshToken, // Use new or fall back to old
        };

        await setSession(newSession);
        return newSession;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
    }
}

/**
 * Clears only the session cookie without redirecting.
 * Used when the session is stale/invalid and needs to be cleared.
 */
export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_SESSION_COOKIE, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
}

/**
 * Clears the session and redirects to Shopify logout.
 */
export async function logout() {
    const session = await getSession();
    const cookieStore = await cookies();

    // Tyhjennetään eväste heti
    cookieStore.delete(CUSTOMER_SESSION_COOKIE);

    if (SHOP_ID && CLIENT_ID && session?.idToken) {
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/login?status=logged_out`;
        const logoutUrl = `https://shopify.com/authentication/${SHOP_ID}/logout?id_token_hint=${session.idToken}&post_logout_redirect_uri=${encodeURIComponent(returnUrl)}`;
        redirect(logoutUrl);
    } else {
        // Jos idTokenia ei jostain syystä ole, ohjataan login-sivulle dynaamisesti
        redirect('/account/login?status=logged_out');
    }
}

/**
 * Checks if the user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
}
