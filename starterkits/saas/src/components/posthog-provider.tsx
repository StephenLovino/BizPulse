"use client";

// import { env } from "@/env"; // Temporarily disabled for initial testing
import { useUser } from "@/lib/supabase/hooks";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

// Temporarily disabled PostHog initialization for testing
// if (typeof window !== "undefined") {
//     posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//         api_host: "/ingest",
//         rate_limiting: {
//             events_burst_limit: 10,
//             events_per_second: 5,
//         },
//         loaded: (posthog) => {
//             if (env.NODE_ENV === "development") posthog.debug();
//         },
//     });
// }

type PostHogProviderProps = {
    children: React.ReactNode;
};

export function PosthogProvider({ children }: PostHogProviderProps) {
    // Temporarily simplified for testing - just return children without PostHog
    return <>{children}</>;
}

function PosthogAuthWrapper({ children }: PostHogProviderProps) {
    const { user, loading } = useUser();

    useEffect(() => {
        if (!loading && user) {
            posthog.identify(user.id, {
                email: user.email,
                name: user.user_metadata?.name || user.email,
            });
        } else if (!loading && !user) {
            posthog.reset();
        }
    }, [user, loading]);

    return children;
}

type CapturePageviewClientProps = {
    captureOnPathChange?: boolean;
};

export function CapturePageviewClient({
    captureOnPathChange = false,
}: CapturePageviewClientProps) {
    const pathname = usePathname();

    useEffect(() => {
        const handleCapturePageview = () => posthog.capture("$pageview");

        handleCapturePageview();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [captureOnPathChange ? pathname : undefined]);

    return null;
}
