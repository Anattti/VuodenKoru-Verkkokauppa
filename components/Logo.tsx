import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center leading-none select-none ${className}`}>
            <span className="font-[family-name:var(--font-oranienbaum)] text-4xl tracking-tight">HL</span>
            <span className="font-[family-name:var(--font-prosto-one)] text-[0.45rem] tracking-[0em] mt-[-0.9em]">
                KORUT
            </span>
        </div>
    );
}
