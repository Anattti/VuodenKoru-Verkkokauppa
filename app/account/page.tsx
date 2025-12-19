import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import { getCustomerProfile, getCustomerOrders } from "@/lib/shopify/customer";
import ShopHeader from "@/components/shop/ShopHeader";
import OrderList from "@/components/account/OrderList";
import Link from "next/link";
import { ChevronRight, Settings, User, LogOut } from "lucide-react";
import { logout } from "@/lib/shopify/auth";

export const metadata = {
    title: "Oma tili | Vuoden Koru",
    description: "Hallinnoi tiliäsi ja tarkastele tilauksiasi.",
};

export default async function AccountPage() {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
    }

    const customer = await getCustomerProfile();

    if (!customer) {
        redirect("/account/login?error=stale_session");
    }

    const orders = await getCustomerOrders();
    const recentOrders = orders.slice(0, 3);

    async function handleLogout() {
        'use server';
        await logout();
    }

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-32 pb-20 max-w-6xl mx-auto px-4">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 mb-2">Tervetuloa takaisin</p>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">Hei, {customer.firstName || 'korun ystävä'}!</h1>
                    </div>
                    <form action={handleLogout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-2"
                        >
                            <LogOut size={16} />
                            <span>Kirjaudu ulos</span>
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-light tracking-tight text-zinc-900 border-l-2 border-zinc-900 pl-4">Viimeisimmät tilaukset</h2>
                            {orders.length > 3 && (
                                <Link href="/account/orders" className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1">
                                    Kaikki tilaukset <ChevronRight size={14} />
                                </Link>
                            )}
                        </div>

                        <OrderList orders={recentOrders} />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-light tracking-tight text-zinc-900 border-l-2 border-zinc-900 pl-4 mb-6">Tilitiedot</h2>
                            <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-100 text-zinc-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">Nimi</p>
                                        <p className="text-sm font-medium text-zinc-900">{customer.firstName} {customer.lastName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-100 text-zinc-400">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">Sähköposti</p>
                                        <p className="text-sm font-medium text-zinc-900">{customer.emailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl p-8 text-white">
                            <h3 className="text-lg font-light mb-4 text-white">Tarvitsetko apua?</h3>
                            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">Jos sinulla on kysyttävää tilauksestasi tai tarvitset muuta apua, asiakaspalvelumme auttaa mielellään.</p>
                            <Link href="/ota-yhteytta" className="inline-block text-xs font-bold uppercase tracking-[0.2em] border-b border-white/30 pb-1 hover:border-white transition-colors text-white">
                                Ota yhteyttä
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
