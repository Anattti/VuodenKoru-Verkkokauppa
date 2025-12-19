import ShopHeader from "@/components/shop/ShopHeader";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <ShopHeader />
            <div className="pt-[100px] md:pt-[120px]"> {/* Offset for fixed header + announcement bar */}
                {children}
            </div>
        </div>
    );
}
