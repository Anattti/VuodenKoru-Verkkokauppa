import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import ShopHeader from "@/components/shop/ShopHeader";

export const metadata = {
    title: "Kirjaudu sisään | Vuoden Koru",
    description: "Kirjaudu sisään tarkastellaksesi tilaushistoriaasi.",
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, status?: string }> }) {
    const { error, status } = await searchParams;

    if (await isAuthenticated() && !error && status !== 'logged_out') {
        redirect("/account");
    }

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-40 pb-20 px-4 max-w-md mx-auto text-center">
                {status === 'logged_out' && (
                    <div className="mb-12 p-6 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-100 text-zinc-900 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                        </div>
                        <p className="text-zinc-900 font-medium">Sinut on kirjattu ulos onnistuneesti.</p>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest">Nähdään pian uudelleen</p>
                    </div>
                )}

                {error === 'auth_failed' && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        Kirjautuminen epäonnistui. Yritä uudelleen.
                    </div>
                )}
                {error === 'stale_session' && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm">
                        Istuntosi on vanhentunut. Ole hyvä ja kirjaudu sisään uudelleen.
                    </div>
                )}

                <h1 className="text-3xl font-light tracking-tight text-zinc-900 mb-6">Asiakastili</h1>
                <p className="text-zinc-500 mb-10 leading-relaxed">Sinut ohjataan Shopifyn suojattuun kirjautumispalveluun.</p>

                <a
                    href="/api/auth/login"
                    className="inline-flex items-center justify-center gap-2 w-full bg-zinc-900 text-white rounded-xl py-4 font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-950/10"
                >
                    <span>Jatka kirjautumiseen</span>
                </a>
            </main>
        </div>
    );
}
