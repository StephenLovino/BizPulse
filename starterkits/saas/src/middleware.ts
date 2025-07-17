import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, siteUrls } from "@/config/urls";
import { getAbsoluteUrl } from "@/lib/utils";
import { env } from "@/env";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    // Update Supabase session
    const response = await updateSession(request);

    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

    /** check if application setting is on or off */
    const maintenanceMode = env.NEXT_PUBLIC_MAINTENANCE_MODE === "on";
    const waitlistMode = env.NEXT_PUBLIC_WAITLIST_MODE === "on";

    if (
        maintenanceMode &&
        !request.nextUrl.pathname.startsWith("/maintenance") &&
        !isAdminPath &&
        !request.nextUrl.pathname.startsWith("/auth")
    ) {
        return NextResponse.redirect(getAbsoluteUrl(siteUrls.maintenance));
    }

    if (
        waitlistMode &&
        !request.nextUrl.pathname.startsWith("/waitlist") &&
        !isAdminPath &&
        !request.nextUrl.pathname.startsWith("/auth")
    ) {
        return NextResponse.redirect(getAbsoluteUrl(siteUrls.waitlist));
    }

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
