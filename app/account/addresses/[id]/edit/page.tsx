import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import { getCustomerAddresses } from "@/lib/shopify/customer";
import ShopHeader from "@/components/shop/ShopHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AddressForm from "@/components/account/AddressForm";

export const metadata = {
    title: "Muokkaa osoitetta | Vuoden Koru",
    description: "Päivitä osoitteesi tiedot.",
};

export default async function EditAddressPage({ params }: { params: { id: string } }) {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
    }

    let addressId: string;
    try {
        addressId = atob(params.id);
    } catch (e) {
        notFound();
    }

    const addresses = await getCustomerAddresses();
    const address = addresses.find(a => a.id === addressId);

    if (!address) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-32 pb-20 max-w-2xl mx-auto px-4">

                <Link
                    href="/account/addresses"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
                >
                    <ChevronLeft size={14} /> Takaisin osoitteisiin
                </Link>

                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">Muokkaa osoitetta</h1>
                    <p className="text-zinc-500 mt-2">Päivitä osoitteesi tiedot alla olevaan lomakkeeseen.</p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                    <AddressForm type="edit" initialAddress={address} />
                </div>
            </main>
        </div>
    );
}
