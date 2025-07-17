/**
 * @purpose This file contains all the site urls
 *
 * To add a new URL:
 * 1. Add a new property to the siteUrls object with the URL path.
 * 2. Import the siteUrls object from "@/config/urls" in the file where you want to use the URL.
 * 3. Use the URL in the file.
 */

export const siteUrls = {
    publicUrl: "https://bizpulse.com",
    github: "https://github.com/yourusername/bizpulse",
    home: "/",
    pricing: "/pricing",
    features: "/features",
    support: "/support",
    blogs: "/blogs",
    docs: "/docs",
    changelogs: "/changelogs",
    maintenance: "/maintenance",
    waitlist: "/waitlist",
    bizpulse: "https://www.bizpulse.com",

    // Public pages
    terms: "/terms",
    privacy: "/privacy",
    qr: "/qr",

    dashboard: {
        home: "/dashboard",
        settings: "/dashboard/settings",
        locations: "/dashboard/locations",
        qr: "/dashboard/qr",
        crm: "/dashboard/crm",
        automations: "/dashboard/automations",
        templates: "/dashboard/templates",
        team: "/dashboard/team",
        billing: "/dashboard/billing",
        subscription: "/dashboard/subscription",
    },
    feedback: "/feedback",
    organization: {
        members: {
            home: "/org/members",
            invite: "/org/members/invite",
        },
        settings: "/org/settings",
        plansAndBilling: "/org/billing",
    },
    auth: {
        login: "/auth/login",
        signup: "/auth/signup",
    },
    admin: {
        overview: "/admin/overview",
        dashboard: "/admin/dashboard",
        users: "/admin/users",
        businesses: "/admin/businesses",
        organizations: "/admin/organizations",
        settings: "/admin/settings",
        waitlist: "/admin/waitlist",
        feedbacks: "/admin/feedbacks",
        analytics: "https://us.posthog.com/project/12312/dashboard",
    },
    profile: {
        settings: "/profile/settings",
        billing: "/profile/billing",
    },
} as const;

export const publicRoutes: string[] = [
    siteUrls.publicUrl,
    siteUrls.home,
    siteUrls.pricing,
    siteUrls.features,
    siteUrls.support,
    siteUrls.blogs,
    siteUrls.docs,
    siteUrls.changelogs,
    siteUrls.maintenance,
    siteUrls.waitlist,
    siteUrls.bizpulse,
    siteUrls.terms,
    siteUrls.privacy,
    siteUrls.qr,
];

export const protectedRoutes: string[] = [
    siteUrls.dashboard.home,
    siteUrls.dashboard.settings,
    siteUrls.dashboard.locations,
    siteUrls.dashboard.qr,
    siteUrls.dashboard.crm,
    siteUrls.dashboard.automations,
    siteUrls.dashboard.templates,
    siteUrls.dashboard.team,
    siteUrls.dashboard.billing,
    siteUrls.dashboard.subscription,
    siteUrls.feedback,
    siteUrls.organization.members.home,
    siteUrls.organization.members.invite,
    siteUrls.organization.settings,
    siteUrls.organization.plansAndBilling,
    siteUrls.auth.login,
    siteUrls.auth.signup,
    siteUrls.admin.overview,
    siteUrls.admin.dashboard,
    siteUrls.admin.users,
    siteUrls.admin.businesses,
    siteUrls.admin.organizations,
    siteUrls.admin.settings,
    siteUrls.admin.waitlist,
    siteUrls.admin.feedbacks,
    siteUrls.admin.analytics,
    siteUrls.profile.settings,
    siteUrls.profile.billing,
];
