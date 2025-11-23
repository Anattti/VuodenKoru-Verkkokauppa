import { siteConfig } from "@/lib/config";

export default function Footer() {
    return (
        <footer className="bg-zinc-100 py-12 text-center text-zinc-500">
            <div className="container mx-auto px-4">
                <h3 className="mb-4 text-xl font-serif text-zinc-900">{siteConfig.footerBrand}</h3>
                <p className="mb-8 text-sm">{siteConfig.footerDesigner}</p>
                <div className="flex justify-center gap-6 text-sm">
                    <a href={siteConfig.instagramUrl} className="hover:text-zinc-900 transition-colors">Instagram</a>
                    <a href={siteConfig.facebookUrl} className="hover:text-zinc-900 transition-colors">Facebook</a>
                    <a href={siteConfig.tiktokUrl} className="hover:text-zinc-900 transition-colors">TikTok</a>
                    <a href="#" className="hover:text-zinc-900 transition-colors">Ota yhteyttä</a>
                </div>
                <p className="mt-12 text-xs opacity-50">{siteConfig.copyright}</p>
            </div>
        </footer>
    );
}
