import Link from "next/link";
import { ChevronRight, Package, Calendar, Truck, CreditCard } from "lucide-react";
import Image from "next/image";
import { CustomerOrder } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/shopify";

interface OrderListProps {
    orders: CustomerOrder[];
}

const getFulfillmentStatus = (status: string) => {
    switch (status) {
        case 'FULFILLED': return { label: 'Toimitettu', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
        case 'IN_PROGRESS': return { label: 'Käsittelyssä', color: 'bg-blue-50 text-blue-700 border-blue-100' };
        case 'ON_HOLD': return { label: 'Pidossa', color: 'bg-amber-50 text-amber-700 border-amber-100' };
        case 'OPEN': return { label: 'Avoin', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'PARTIALLY_FULFILLED': return { label: 'Osittain toimitettu', color: 'bg-blue-50 text-blue-700 border-blue-100' };
        case 'PENDING_FULFILLMENT': return { label: 'Odottaa toimitusta', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'RESTOCKED': return { label: 'Palautettu varastoon', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'SCHEDULED': return { label: 'Ajastettu', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'UNFULFILLED': return { label: 'Käsittelyssä', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        default: return { label: status, color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
    }
};

const getFinancialStatus = (status: string) => {
    switch (status) {
        case 'PAID': return { label: 'Maksettu', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
        case 'PENDING': return { label: 'Odottaa maksua', color: 'bg-amber-50 text-amber-700 border-amber-100' };
        case 'AUTHORIZED': return { label: 'Valtuutettu', color: 'bg-blue-50 text-blue-700 border-blue-100' };
        case 'PARTIALLY_PAID': return { label: 'Osittain maksettu', color: 'bg-blue-50 text-blue-700 border-blue-100' };
        case 'PARTIALLY_REFUNDED': return { label: 'Osittain hyvitetty', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'REFUNDED': return { label: 'Hyvitetty', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        case 'VOIDED': return { label: 'Mitätöity', color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
        default: return { label: status, color: 'bg-zinc-50 text-zinc-700 border-zinc-100' };
    }
};

export default function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <Package className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Ei tilauksia vielä</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Et ole vielä tehnyt tilauksia. Kun teet tilauksen, se näkyy tässä.</p>
                <Link
                    href="/shop"
                    className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline underline-offset-4"
                >
                    Tutustu mallistoon <ChevronRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const fStatus = getFulfillmentStatus(order.fulfillmentStatus);
                const pStatus = getFinancialStatus(order.financialStatus);
                const tracking = order.fulfillments?.edges[0]?.node?.trackingInformation[0];

                return (
                    <div
                        key={order.id}
                        className="bg-white border border-zinc-100 rounded-2xl p-6 hover:shadow-sm transition-all group"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors shrink-0">
                                    <Package size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1.6">
                                        <h3 className="font-medium text-zinc-900">Tilaus {order.name}</h3>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${fStatus.color}`}>
                                            {fStatus.label}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pStatus.color}`}>
                                            {pStatus.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(order.processedAt).toLocaleDateString('fi-FI')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CreditCard size={12} />
                                            {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 shrink-0">
                                {tracking && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg text-xs font-medium text-zinc-600">
                                        <Truck size={14} className="text-zinc-400" />
                                        <span>{tracking.company}:</span>
                                        {tracking.url ? (
                                            <a href={tracking.url} target="_blank" rel="noopener noreferrer" className="text-zinc-900 hover:underline">
                                                {tracking.number}
                                            </a>
                                        ) : (
                                            <span className="text-zinc-900">{tracking.number}</span>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href={`/account/orders/${btoa(order.id)}`}
                                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-900 hover:underline underline-offset-4"
                                >
                                    Tilaustiedot <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Line items preview */}
                        <div className="mt-6 pt-6 border-t border-zinc-50 flex flex-wrap gap-4">
                            {order.lineItems.edges.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
                                        {item.node.image ? (
                                            <Image
                                                src={item.node.image.url}
                                                alt={item.node.image.altText || item.node.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <Package size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-medium text-zinc-900 line-clamp-1 max-w-[120px]">{item.node.title}</p>
                                        <p className="text-zinc-500">{item.node.quantity} kpl</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
