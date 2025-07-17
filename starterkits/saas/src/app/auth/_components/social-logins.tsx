"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { siteUrls } from "@/config/urls";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

/**
    For additional social logins:

    - Create a new button for each additional social login. Ensure to use the `variant="outline"` property and set the icon to represent the respective social platform.
    - Add the corresponding configuration for each new social login in the Supabase dashboard under Authentication > Providers

    For more information on providers, refer to the Supabase documentation: @see https://supabase.com/docs/guides/auth/social-login
*/

export function SocialLogins() {
    const [isLoading, setIsLoading] = useState(false);

    const githubLogin = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${siteUrls.dashboard.home}`,
                },
            });

            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${siteUrls.dashboard.home}`,
                },
            });

            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <Button
                onClick={githubLogin}
                variant="outline"
                className="w-full gap-2"
                disabled={isLoading}
            >
                <Icons.gitHub className="h-3.5 w-3.5 fill-foreground" />
                <span>Continue with Github</span>
            </Button>
            <Button
                onClick={googleLogin}
                variant="outline"
                className="w-full gap-2"
                disabled={isLoading}
            >
                <Icons.google className="h-3.5 w-3.5 fill-foreground" />
                <span>Continue with Google</span>
            </Button>
        </div>
    );
}
