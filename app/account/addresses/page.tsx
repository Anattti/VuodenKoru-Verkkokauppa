import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import { getCustomerAddresses, getCustomerProfile } from "@/lib/shopify/customer";
import ShopHeader from "@/components/shop/ShopHeader";
import Link from "next/link";
import { ChevronLeft, Plus, MapPin } from "lucide-react";
import AddressCard from "@/components/account/AddressCard";

export const metadata = {
    title: "Osoitteet | Vuoden Koru",
    description: "Hallinnoi toimitus- ja laskutusosoitteitasi.",
};

export default async function AddressesPage() {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
    }

    const [addresses, profile] = await Promise.all([
        getCustomerAddresses(),
        getCustomerProfile()
    ]);

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

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">Osoitteet</h1>
                        <p className="text-zinc-500 mt-2">Hallinnoi toimitus- ja laskutusosoitteitasi.</p>
                    </div>
                    <Link
                        href="/account/addresses/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        <Plus size={16} />
                        Lisää uusi osoite
                    </Link>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <MapPin className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">Ei tallennettuja osoitteita</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto">Lisää ensimmäinen osoitteesi helpottaaksesi tilaamista jatkossa.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                isDefault={address.id === profile?.defaultAddress?.id}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
