import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const { searchParams, origin } = requestUrl;
    const code = searchParams.get('code');

    // Attempt to extract locale from the origin or existing path if possible
    // Default to 'en' if not found
    const segments = requestUrl.pathname.split('/');
    const locale = segments.find(s => s === 'en' || s === 'rw') || 'en';

    // if "next" is in search params, use it as the redirection URL
    let next = searchParams.get('next') ?? `/${locale}`;
    if (!next.startsWith('/')) next = `/${next}`;
    if (!next.startsWith(`/${locale}`)) next = `/${locale}${next === '/' ? '' : next}`;

    if (code) {
        const supabase = getSupabaseServer();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error('Auth code exchange error:', error);
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
