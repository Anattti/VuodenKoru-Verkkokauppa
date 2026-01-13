import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/shopify/auth";
import { getOrderDetail } from "@/lib/shopify/customer";
import ShopHeader from "@/components/shop/ShopHeader";
import Link from "next/link";
import { ChevronLeft, Package, Calendar, Truck, CreditCard, MapPin, Hash } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/shopify";

export const metadata = {
    title: "Tilauksen tiedot | Vuoden Koru",
    description: "Tarkastele tilauksesi tietoja ja tilaa.",
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    if (!(await isAuthenticated())) {
        redirect("/account/login");
    }

    let orderId: string;
    try {
        orderId = atob(params.id);
    } catch (e) {
        notFound();
    }

    const order = await getOrderDetail(orderId);

    if (!order) {
        notFound();
    }

    const getFulfillmentStatus = (status: string) => {
        switch (status) {
            case 'FULFILLED': return { label: 'Toimitettu', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
            case 'IN_PROGRESS': return { label: 'Käsittelyssä', color: 'bg-blue-50 text-blue-700 border-blue-100' };
            case 'UNFULFILLED': return { label: 'Käsittelyssä', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
            default: return { label: status, color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        }
    };

    const getFinancialStatus = (status: string) => {
        switch (status) {
            case 'PAID': return { label: 'Maksettu', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
            case 'PENDING': return { label: 'Odottaa maksua', color: 'bg-amber-50 text-amber-700 border-amber-100' };
            default: return { label: status, color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        }
    };

    const fStatus = getFulfillmentStatus(order.fulfillmentStatus);
    const pStatus = getFinancialStatus(order.financialStatus);
    const tracking = order.fulfillments?.edges[0]?.node?.trackingInformation[0];

    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4">

                <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
                >
                    <ChevronLeft size={14} /> Takaisin tilauksiin
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-light tracking-tight text-zinc-900">Tilaus {order.name}</h1>
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${fStatus.color}`}>
                                {fStatus.label}
                            </span>
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pStatus.color}`}>
                                {pStatus.label}
                            </span>
                        </div>
                        <p className="text-zinc-500 flex items-center gap-2 text-sm">
                            <Calendar size={14} />
                            Tilattu {new Date(order.processedAt).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    {order.statusPageUrl && (
                        <a
                            href={order.statusPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-colors"
                        >
                            <Truck size={16} />
                            Seuraa lähetystä
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden text-zinc-900">
                            <div className="p-6 border-b border-zinc-50">
                                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Package size={16} className="text-zinc-400" />
                                    Tuotteet
                                </h2>
                            </div>
                            <div className="divide-y divide-zinc-50">
                                {order.lineItems.edges.map((item, idx) => (
                                    <div key={idx} className="p-6 flex items-center gap-6">
                                        <div className="relative w-20 h-20 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 shrink-0">
                                            {item.node.image ? (
                                                <Image
                                                    src={item.node.image.url}
                                                    alt={item.node.image.altText || item.node.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                    <Package size={32} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-zinc-900 mb-1">{item.node.title}</h3>
                                            <p className="text-sm text-zinc-500">{item.node.quantity} kpl</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-zinc-50/50 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 font-medium">Yhteensä</span>
                                    <span className="font-bold text-lg text-zinc-900">
                                        {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {tracking && (
                            <div className="bg-zinc-900 rounded-2xl p-8 text-white">
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Truck size={16} className="text-zinc-400" />
                                    Toimitustiedot
                                </h2>
                                <div className="space-y-4 text-zinc-900">
                                    <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.6">Kuljetusyhtiö</p>
                                            <p className="text-sm font-medium text-zinc-900">{tracking.company}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.6 text-right font-medium">Seurantakoodi</p>
                                            <p className="text-sm font-bold text-zinc-900 text-right">{tracking.number}</p>
                                        </div>
                                    </div>
                                    {tracking.url && (
                                        <a
                                            href={tracking.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center py-3 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-colors"
                                        >
                                            Katso seuranta kuljetusyhtiön sivuilta
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8 text-zinc-900">
                        {/* Summary & Contact */}
                        <div className="bg-zinc-50 rounded-2xl p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <CreditCard size={16} className="text-zinc-400" />
                                Maksu & Yhteenveto
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-zinc-200/50">
                                    <span className="text-xs text-zinc-400 font-medium tracking-tight">Tilan numero</span>
                                    <span className="text-sm font-bold flex items-center gap-1.6 tracking-tight">
                                        <Hash size={12} className="text-zinc-400" />
                                        {order.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-xs text-zinc-400 font-medium tracking-tight uppercase">Loppusumma</span>
                                    <span className="text-lg font-bold text-zinc-900 tracking-tighter">
                                        {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin size={16} className="text-zinc-400" />
                                Tilaus tuki
                            </h2>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                                Onko sinulla kysyttävää tilauksestasi? Olemme täällä auttaaksemme.
                            </p>
                            <Link
                                href="/ota-yhteytta"
                                className="block w-full text-center py-3 bg-zinc-50 text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors"
                            >
                                Ota yhteyttä
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
