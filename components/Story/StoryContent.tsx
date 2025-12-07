"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const storySections = [
    {
        id: "inspiration",
        title: "Inspiraatio",
        text: "Täplät-korusarjan inspiraationa toimii jaguaarin ylväys, villi voima ja luonnon orgaaninen monimuotoisuus. Hopean ja tiikerinsilmän yhdistelmä tuo esiin kissapetojen itsevarmuuden ja kantajansa sisäisen voiman. Mallisto sai alkunsa näyttötyöstä ja kuvitteellisesta eteläamerikkalaisesta tutkijasta, joka rakastaa kissaeläimiä. Tarina, joka avasi tien rohkeille muodoille ja villille estetiikalle.",
        image: "/images/TuoteKuvat/StorySection4.webp"
    },
    {
        id: "process",
        title: "Prosessi",
        text: "Yhdistän suunnittelussa luonnon tutkimisen, käsityöperinteen ja modernin teknologian. Jaguarin täplistä inspiroituneet muodot syntyivät luonnostelun ja asiakkaan mielenkiinnonkohteiden tutkimisen kautta. Jokainen koru on uniikki, sillä orgaanisten muotojen hienovarainen vaihtelu viimeistellään käsin. Teknologiaa hyödynnetään erityisesti istuvuuden ja käytettävyyden varmistamiseen, kuten choker-kaulakorun tarkassa muotoilussa.",
        image: "/images/TuoteKuvat/StorySection2.webp"
    },
    {
        id: "result",
        title: "lopputulos",
        text: "Täplät on kuuden korun kokonaisuus: näyttävä käätykaulakoru, elegantti riipus, kahdet korvakorut, rannekoru ja sormus. Niissä yhdistyvät kiiltävät pinnat, täplämäiset tekstuurit sekä tiikerinsilmän lämmin hehku. Lopputuloksena on voimakas, omaleimainen korusarja, joka tuo kantajalleen itsevarmuutta – niin arkeen kuin juhlaan. Täplät erottuu rohkeudellaan, tarinallaan ja vahvalla visuaalisella identiteetillään.",
        image: "/images/TuoteKuvat/StorySection3.webp"
    }
];

export default function StoryContent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<HTMLElement>(".story-section");
            const images = gsap.utils.toArray<HTMLElement>(".story-image");

            ScrollTrigger.matchMedia({
                // Desktop
                "(min-width: 768px)": function () {
                    // Pin the right side (images)
                    ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        pin: imagesRef.current,
                        scrub: true,
                    });
                },
                // Mobile
                "(max-width: 767px)": function () {
                    // No pinning needed as images are fixed
                }
            });

            // Animate images based on scroll position - desktop only
            ScrollTrigger.matchMedia({
                // Desktop
                "(min-width: 768px)": function () {
                    sections.forEach((section, i) => {
                        ScrollTrigger.create({
                            trigger: section,
                            start: "top center",
                            end: "bottom center",
                            onEnter: () => {
                                gsap.to(images, { opacity: 0, duration: 0.5 });
                                gsap.to(images[i], { opacity: 1, duration: 0.5 });
                            },
                            onEnterBack: () => {
                                gsap.to(images, { opacity: 0, duration: 0.5 });
                                gsap.to(images[i], { opacity: 1, duration: 0.5 });
                            }
                        });
                    });
                },
                // Mobile
                "(max-width: 767px)": function () {
                    const mobileImages = gsap.utils.toArray<HTMLElement>(".mobile-story-image");
                    mobileImages.forEach((img) => {
                        gsap.to(img, {
                            y: "20%", // Move image down
                            ease: "none",
                            scrollTrigger: {
                                trigger: img.parentElement, // Trigger based on the container
                                start: "top bottom", // Start when container enters viewport
                                end: "bottom top", // End when container leaves viewport
                                scrub: true,
                            }
                        });
                    });
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative bg-neutral-900 text-white">
            <div className="flex flex-col md:flex-row">
                {/* Left Column: Text */}
                <div className="w-full md:w-1/2 z-10 relative">
                    {storySections.map((section) => (
                        <div
                            key={section.id}
                            className="story-section min-h-screen flex flex-col justify-center px-4 md:px-20 py-20"
                        >
                            {/* Mobile Image */}
                            <div className="md:hidden w-full aspect-[4/5] relative mb-8 rounded-lg overflow-hidden">
                                <div className="absolute inset-0 h-[120%] -top-[10%] mobile-story-image">
                                    <Image
                                        src={section.image}
                                        alt={`${section.title} – Täplät-korusarja`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="md:p-0">
                                <span className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4 block">
                                    0{storySections.indexOf(section) + 1}
                                </span>
                                <h2 className="font-antonio text-5xl md:text-7xl mb-8 uppercase text-white">
                                    {section.title}
                                </h2>
                                <p className="font-sans text-lg md:text-xl leading-relaxed text-neutral-400 max-w-md">
                                    {section.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Sticky Images (Desktop Only) */}
                <div
                    ref={imagesRef}
                    className="hidden md:block w-1/2 h-screen sticky top-0 overflow-hidden"
                >
                    {storySections.map((section, i) => (
                        <div
                            key={section.id}
                            className={`story-image absolute inset-0 w-full h-full transition-opacity duration-700 ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Image
                                src={section.image}
                                alt={`${section.title} – Täplät-korusarja`}
                                fill
                                className="object-cover"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
