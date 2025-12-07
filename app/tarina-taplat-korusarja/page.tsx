import type { Metadata } from "next";

import StoryHero from "@/components/Story/StoryHero";
import StoryContent from "@/components/Story/StoryContent";
import StoryArticle from "@/components/Story/StoryArticle";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/config";

const title = "Tarina Täplät-korusarjan takana";
const description =
  "Vuoden Koru 2026 -finalistin, Täplät-korusarjan syntytarina: inspiraatio jaguaarista, käsityö ja teknologia, orgaaniset muodot sekä tiikerinsilmän lämpö.";
const url = "https://www.helilampi.fi/tarina-taplat-korusarja";
const image = "https://www.helilampi.fi/images/TuoteKuvat/StorySectionHero2.webp";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Täplät-korusarja",
    "Heli Lampi",
    "Vuoden Koru 2026",
    "finalisti",
    "jaguaarin inspiroima koru",
    "suomalainen korumuotoilu",
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "article",
    url,
    title,
    description,
    siteName: siteConfig.brandName,
    locale: "fi_FI",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: siteConfig.instagramHandle,
  },
};

export default function StoryPage() {
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": [image],
        "author": {
            "@type": "Person",
            "name": siteConfig.designerName,
            "url": "https://www.helilampi.fi"
        },
        "publisher": {
            "@type": "Organization",
            "name": siteConfig.brandName,
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.helilampi.fi/icon.svg"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "datePublished": "2025-12-01",
        "dateModified": "2025-12-07"
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Mikä on Täplät-korusarja?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Täplät-korusarja on Heli Lammen suunnittelema Vuoden Koru 2026 -finalistityö, jonka muotokieli on inspiroitunut jaguaarin eläväisestä kuviosta."
                }
            },
            {
                "@type": "Question",
                "name": "Mistä korusarja ammentaa inspiraationsa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sarja yhdistää jaguaarin orgaaniset täplät, käsityötaidon ja modernin valmistusteknologian luoden herkän mutta näyttävän muotokielen."
                }
            },
            {
                "@type": "Question",
                "name": "Mitä materiaaleja Täplät-korusarja käyttää?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Koruissa hyödynnetään jalometalleja ja tiikerinsilmää, joiden lämpimät sävyt korostavat orgaanista muotoilua."
                }
            },
            {
                "@type": "Question",
                "name": "Mistä voin nähdä tai hankkia korusarjan?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Korusarjaa voi seurata Heli Lammen kanavissa ja Vuoden Koru 2026 -kilpailun yhteydessä; yhteydenotot ja tilaukset onnistuvat sivun Ota yhteyttä -painikkeen kautta."
                }
            }
        ]
    };

    return (
        <main className="bg-black min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <Navbar />
            <StoryHero />
            <StoryContent />
            <StoryArticle />
            <Footer />
        </main>
    );
}
