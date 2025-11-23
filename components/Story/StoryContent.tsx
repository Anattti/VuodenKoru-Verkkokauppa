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
        text: "Luonnon kauneus ja pohjolan karu maisema toimivat inspiraationa tälle ainutlaatuiselle korulle. Jokainen yksityiskohta on harkittu tarkkaan, heijastaen valoa ja varjoa tavalla, joka tuo mieleen ensilumen kimalluksen.",
        image: "/images/TuoteKuvat/IMG_1299.webp"
    },
    {
        id: "process",
        title: "Prosessi",
        text: "Kilpailutyö vaati kuukausien suunnittelun ja kymmeniä tunteja käsityötä. Materiaalivalinnat tehtiin kestävyys ja estetiikka edellä, yhdistäen perinteiset tekniikat moderniin muotoiluun.",
        image: "/images/TuoteKuvat/Kanavaistutus tuotekuva 1 kopio.webp"
    },
    {
        id: "result",
        title: "Tulos",
        text: "Lopputulos on enemmän kuin koru – se on tarina, joka elää kantajansa mukana. Vuoden Koru -finaalipaikka on osoitus tinkimättömästä laadusta ja taiteellisesta näkemyksestä.",
        image: "/images/TuoteKuvat/Näyttö 2, rannekoru tuotekuvat 1 pysty.webp"
    }
];

export default function StoryContent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<HTMLElement>(".story-section");
            const images = gsap.utils.toArray<HTMLElement>(".story-image");

            // Pin the right side (images)
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: imagesRef.current,
                scrub: true,
            });

            // Animate images based on scroll position
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

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative bg-neutral-900 text-white">
            <div className="flex flex-col md:flex-row">
                {/* Left Column: Text */}
                <div className="w-full md:w-1/2 z-10">
                    {storySections.map((section) => (
                        <div
                            key={section.id}
                            className="story-section min-h-screen flex flex-col justify-center px-8 md:px-20 py-20"
                        >
                            <span className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4">
                                0{storySections.indexOf(section) + 1}
                            </span>
                            <h2 className="font-antonio text-5xl md:text-7xl mb-8 uppercase text-white">
                                {section.title}
                            </h2>
                            <p className="font-sans text-lg md:text-xl leading-relaxed text-neutral-400 max-w-md">
                                {section.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right Column: Sticky Images */}
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
                                alt={section.title}
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
