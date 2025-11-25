import { siteConfig } from "@/lib/config";

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": siteConfig.designerName,
        "url": "https://www.helilampi.fi",
        "jobTitle": siteConfig.profession,
        "description": siteConfig.description,
        "image": "https://www.helilampi.fi/images/hero-jewelry.jpg",
        "sameAs": [
            siteConfig.instagramUrl,
            siteConfig.facebookUrl,
            siteConfig.tiktokUrl
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
