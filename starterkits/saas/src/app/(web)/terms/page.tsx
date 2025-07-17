import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - BizPulse",
    description: "Terms of Service for BizPulse business management platform",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
            
            <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg text-muted-foreground mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using BizPulse ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p>
                        BizPulse is a business management platform that provides QR code generation, customer relationship management (CRM), automated messaging, and business analytics tools. The Service allows businesses to capture customer information through QR codes and manage customer relationships through automated workflows.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                    <p>
                        To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                    <p>
                        You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                        <li>To send spam, unsolicited messages, or engage in any form of harassment</li>
                        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                        <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Data and Privacy</h2>
                    <p>
                        Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payment</h2>
                    <p>
                        Some features of the Service require a paid subscription. Subscription fees are billed in advance on a monthly or annual basis and are non-refundable except as required by law.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                    <p>
                        In no event shall BizPulse, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at support@bizpulse.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
