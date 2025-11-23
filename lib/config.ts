import { isPreview } from "./env";

export { isPreview };
export const siteConfig = {
    brandName: isPreview ? "Brand Name" : "HL Korut",
    designerName: isPreview ? "Designer Name" : "Heli Lampi",
    initials: isPreview ? "BN" : "HL",
    contestName: isPreview ? "Design Contest 2026" : "Vuoden Koru 2026",
    contestFinalist: isPreview ? "Finalist" : "Finalisti",
    location: isPreview ? "City, Country" : "Oulu, Finland",
    email: isPreview ? "contact@example.com" : "helilampi@icloud.com",
    phone: isPreview ? "+123 456 7890" : "+358 44 343 7802",
    instagramHandle: isPreview ? "@brand.name" : "@h.l.korut",
    instagramUrl: isPreview ? "https://instagram.com" : "https://instagram.com/h.l.korut",
    facebookUrl: isPreview ? "https://facebook.com" : "https://www.facebook.com/people/Heli-Lampi/61561959849448/#",
    tiktokUrl: isPreview ? "https://tiktok.com" : "https://www.tiktok.com/@h.l.korut?_r=1&_t=ZN-91cUxnewSUI",
    profession: isPreview ? "Jewelry Designer" : "Jalometallialan artesaani",
    slogan: isPreview ? "Design that speaks. Craft that lasts." : "Muotoilu, joka puhuttelee. Käsityö, joka kestää.",
    description: isPreview
        ? "The designer's jewelry has been selected as a finalist in the Design Contest 2026. This recognition is a testament to uncompromising quality and unique vision."
        : "Heli Lammen korut on valittu Vuoden Koru 2026 -kilpailun finaaliin. Tämä tunnustus on osoitus tinkimättömästä laadusta ja ainutlaatuisesta näkemyksestä suomalaisessa korumuotoilussa.",
    metaTitle: isPreview ? "Designer Name | Finalist 2026" : "Heli Lampi | Vuoden Koru 2026 Finalisti",
    metaDescription: isPreview
        ? "Discover the finalist jewelry collection. Unique design."
        : "Tutustu Heli Lammen Vuoden Koru 2026 -finaalikoruun. Uniikkia suomalaista korumuotoilua.",
    footerBrand: isPreview ? "Brand Name" : "HL Korut",
    footerDesigner: isPreview ? "Designer Name Design" : "Heli Lampi Design",
    copyright: isPreview ? "© 2025 Brand Name. All rights reserved." : "© 2025 HL Korut. All rights reserved."
};
