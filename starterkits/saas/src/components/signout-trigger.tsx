"use client";

import { Slot } from "@radix-ui/react-slot";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { siteUrls } from "@/config/urls";
import React from "react";

type SignoutTriggerProps = {
    callbackUrl?: string;
    redirect?: boolean;
    asChild?: boolean;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

export function SignoutTrigger({
    callbackUrl = siteUrls.auth.login,
    redirect = true,
    asChild,
    children,
    ...props
}: SignoutTriggerProps) {
    const Comp = asChild ? Slot : "button";
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error);
                return;
            }

            if (redirect) {
                router.push(callbackUrl);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Comp
            onClick={handleSignOut}
            {...props}
        >
            {children}
        </Comp>
    );
}
