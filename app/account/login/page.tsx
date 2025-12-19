import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import ShopHeader from "@/components/shop/ShopHeader";

export const metadata = {
    title: "Kirjaudu sisään | Vuoden Koru",
    description: "Kirjaudu sisään tarkastellaksesi tilaushistoriaasi.",
};

export default async function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
    const { error } = await searchParams;

    if (await isAuthenticated()) {
        redirect("/account");
    }

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-40 pb-20 px-4 max-w-md mx-auto text-center">
                {error === 'auth_failed' && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        Kirjautuminen epäonnistui. Yritä uudelleen.
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
