import Link from "next/link";
import { ChevronRight, Package, Calendar } from "lucide-react";
import Image from "next/image";
import { CustomerOrder } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/shopify";

interface OrderListProps {
    orders: CustomerOrder[];
}

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
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white border border-zinc-100 rounded-2xl p-6 hover:shadow-sm transition-all group"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                <Package size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-medium text-zinc-900">Tilaus {order.name}</h3>
                                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(order.processedAt).toLocaleDateString('fi-FI')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="text-right">
                                <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Yhteensä</p>
                                <p className="font-medium text-zinc-900">
                                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                </p>
                            </div>

                            <a
                                href={order.statusPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-900 hover:underline underline-offset-4"
                            >
                                Seuraa tilausta <ChevronRight size={14} />
                            </a>
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
            ))}
        </div>
    );
}
