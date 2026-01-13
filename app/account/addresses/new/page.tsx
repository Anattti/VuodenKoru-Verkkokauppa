import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import ShopHeader from "@/components/shop/ShopHeader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AddressForm from "@/components/account/AddressForm";

export const metadata = {
    title: "Uusi osoite | Vuoden Koru",
    description: "Lisää uusi osoite tilillesi.",
};

export default async function NewAddressPage() {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
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
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">Uusi osoite</h1>
                    <p className="text-zinc-500 mt-2">Täytä uuden osoitteen tiedot alle.</p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                    <AddressForm type="create" />
                </div>
            </main>
        </div>
    );
}
