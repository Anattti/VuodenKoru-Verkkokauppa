'use client';

import { CustomerAddress } from "@/lib/shopify/customer";
import { MapPin, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { deleteAddressAction } from "@/app/account/addresses/actions";
import { useState } from "react";

interface AddressCardProps {
    address: CustomerAddress;
    isDefault?: boolean;
}

export default function AddressCard({ address, isDefault }: AddressCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm('Haluatko varmasti poistaa tämän osoitteen?')) return;

        setIsDeleting(true);
        try {
            const result = await deleteAddressAction(address.id);
            if (result.errors) {
                alert(result.errors[0].message);
                setIsDeleting(false);
            }
        } catch (error) {
            alert('Poistaminen epäonnistui.');
            setIsDeleting(false);
        }
    }

    return (
        <div className={`bg-white border rounded-2xl p-6 transition-all ${isDefault ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-100 hover:border-zinc-200'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDefault ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                        <MapPin size={16} />
                    </div>
                    {isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Oletusosoite
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/account/addresses/${btoa(address.id)}/edit`}
                        className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        title="Muokkaa"
                    >
                        <Edit2 size={16} />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Poista"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-1 text-sm text-zinc-900">
                <p className="font-bold">{address.firstName} {address.lastName}</p>
                {address.company && <p className="text-zinc-500">{address.company}</p>}
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.zip} {address.city}</p>
                <p className="text-zinc-500 uppercase tracking-widest text-[10px] mt-2">{address.territoryCode}</p>
                {address.phoneNumber && (
                    <p className="text-zinc-500 mt-2 flex items-center gap-1">
                        <span className="text-[10px] uppercase font-medium">Puh:</span> {address.phoneNumber}
                    </p>
                )}
            </div>
        </div>
    );
}
