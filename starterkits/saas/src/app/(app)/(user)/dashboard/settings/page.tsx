import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardSettingsPageConfig } from "@/app/(app)/(user)/dashboard/settings/_constants/page-config";
import { UserSettingsForm } from "@/app/(app)/(user)/dashboard/settings/_components/user-settings-form";
import { BusinessSettingsForm } from "@/app/(app)/(user)/dashboard/settings/_components/business-settings-form";
import { Separator } from "@/components/ui/separator";

export default function DashboardSettingsPage() {
    return (
        <AppPageShell
            title={dashboardSettingsPageConfig.title}
            description={dashboardSettingsPageConfig.description}
        >
            <div className="space-y-8">
                {/* User Account Settings */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Account Settings</h2>
                        <p className="text-muted-foreground">
                            Manage your personal account information and preferences.
                        </p>
                    </div>
                    <UserSettingsForm />
                </section>

                <Separator />

                {/* Business Settings */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Business Settings</h2>
                        <p className="text-muted-foreground">
                            Configure your business information and default settings.
                        </p>
                    </div>
                    <BusinessSettingsForm />
                </section>
            </div>
        </AppPageShell>
    );
}
