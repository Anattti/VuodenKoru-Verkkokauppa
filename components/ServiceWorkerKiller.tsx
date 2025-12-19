"use client";

import { useEffect } from "react";

export default function ServiceWorkerKiller() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    console.log('Unregistering service worker:', registration);
                    registration.unregister();
                }
            });
        }
    }, []);

    return null;
}
