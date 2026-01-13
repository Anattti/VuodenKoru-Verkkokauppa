'use client';

import { CustomerAddress, CustomerAddressInput } from "@/lib/shopify/customer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAddressAction, updateAddressAction } from "@/app/account/addresses/actions";
import { Loader2 } from "lucide-react";

interface AddressFormProps {
    initialAddress?: CustomerAddress;
    type: 'create' | 'edit';
}

export default function AddressForm({ initialAddress, type }: AddressFormProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        try {
            const result = type === 'create'
                ? await createAddressAction(formData)
                : await updateAddressAction(initialAddress!.id, formData);

            if (result.errors) {
                setError(result.errors[0].message);
                setIsPending(false);
            } else {
                router.push('/account/addresses');
                router.refresh();
            }
        } catch (err) {
            setError('Jokin meni vikaan. Yritä uudelleen.');
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Etunimi</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        defaultValue={initialAddress?.firstName}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sukunimi</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        defaultValue={initialAddress?.lastName}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Yritys (valinnainen)</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    defaultValue={initialAddress?.company}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address1" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Osoite</label>
                <input
                    type="text"
                    id="address1"
                    name="address1"
                    required
                    defaultValue={initialAddress?.address1}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address2" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Osoitteen tarkenne (valinnainen)</label>
                <input
                    type="text"
                    id="address2"
                    name="address2"
                    defaultValue={initialAddress?.address2}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="zip" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Postinumero</label>
                    <input
                        type="text"
                        id="zip"
                        name="zip"
                        required
                        defaultValue={initialAddress?.zip}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Kaupunki</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        defaultValue={initialAddress?.city}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="territoryCode" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Maa (ISO-koodi, esim. FI)</label>
                    <input
                        type="text"
                        id="territoryCode"
                        name="territoryCode"
                        required
                        maxLength={2}
                        defaultValue={initialAddress?.territoryCode || 'FI'}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900 uppercase"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Puhelinnumero</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        defaultValue={initialAddress?.phoneNumber}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-zinc-900"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    className="w-5 h-5 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-zinc-700">Aseta oletusosoitteeksi</label>
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-8 py-4 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isPending && <Loader2 size={16} className="animate-spin" />}
                    {type === 'create' ? 'Lisää osoite' : 'Tallenna muutokset'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4 bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
                >
                    Peruuta
                </button>
            </div>
        </form>
    );
}
