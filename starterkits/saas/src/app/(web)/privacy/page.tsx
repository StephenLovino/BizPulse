import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - BizPulse",
    description: "Privacy Policy for BizPulse business management platform",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
            
            <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg text-muted-foreground mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                    </p>
                    
                    <h3 className="text-xl font-medium mt-4 mb-2">Personal Information</h3>
                    <ul className="list-disc pl-6">
                        <li>Name and email address</li>
                        <li>Business information (company name, industry)</li>
                        <li>Contact information (phone number, address)</li>
                        <li>Payment information (processed securely through third-party providers)</li>
                    </ul>

                    <h3 className="text-xl font-medium mt-4 mb-2">Customer Data</h3>
                    <ul className="list-disc pl-6">
                        <li>Customer information collected through QR code forms</li>
                        <li>Communication preferences and history</li>
                        <li>Interaction data with your business</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process transactions and send related information</li>
                        <li>Send technical notices, updates, security alerts, and support messages</li>
                        <li>Respond to your comments, questions, and customer service requests</li>
                        <li>Communicate with you about products, services, offers, and events</li>
                        <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>With your consent</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect our rights and safety</li>
                        <li>With service providers who assist us in operating our platform</li>
                        <li>In connection with a merger, acquisition, or sale of assets</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Customer data is retained according to your business requirements and applicable laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                    <p>Depending on your location, you may have the following rights:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Access to your personal information</li>
                        <li>Correction of inaccurate information</li>
                        <li>Deletion of your personal information</li>
                        <li>Restriction of processing</li>
                        <li>Data portability</li>
                        <li>Objection to processing</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                    <p>
                        We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookies through your browser settings.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
                    <p>
                        Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibant mb-4">9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at privacy@bizpulse.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
