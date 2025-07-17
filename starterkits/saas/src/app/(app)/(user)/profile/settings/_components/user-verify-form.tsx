"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { siteUrls } from "@/config/urls";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type UserVerifyFormProps = {
    user: User;
};

export function UserVerifyForm({ user }: UserVerifyFormProps) {
    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email: user.email!,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=${siteUrls.profile.settings}`,
                },
            });
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Verification email sent! Check your inbox.");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to send verification email");
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verify your email</CardTitle>
                <CardDescription>
                    Verify your email to enable all features
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button
                    disabled={isPending}
                    onClick={() => mutate()}
                    className="gap-2"
                >
                    {isPending ? <Icons.loader className="h-4 w-4" /> : null}
                    <span>Verify Email</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
