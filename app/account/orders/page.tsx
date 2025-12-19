import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import { getCustomerOrders } from "@/lib/shopify/customer";
import ShopHeader from "@/components/shop/ShopHeader";
import OrderList from "@/components/account/OrderList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Tilaushistoria | Vuoden Koru",
    description: "Tarkastele kaikkia tilauksiasi.",
};

export default async function OrdersPage() {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
    }

    const orders = await getCustomerOrders();

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4">

                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
                >
                    <ChevronLeft size={14} /> Takaisin tiliin
                </Link>

                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">Tilaushistoria</h1>
                    <p className="text-zinc-500 mt-2">Tässä näet kaikki aiemmat tilauksesi.</p>
                </div>

                <OrderList orders={orders} />
            </main>
        </div>
    );
}
