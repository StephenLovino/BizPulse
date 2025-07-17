import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { QRFormCapture } from "./_components/qr-form-capture";

interface QRPageProps {
    params: {
        code: string;
    };
}

export async function generateMetadata({ params }: QRPageProps): Promise<Metadata> {
    return {
        title: `QR Code Form - ${params.code}`,
        description: "Fill out this form to connect with our business",
    };
}

// This would typically fetch QR code data from your database
async function getQRCodeData(code: string) {
    // TODO: Implement actual database lookup
    // For now, return mock data
    if (!code || code.length < 5) {
        return null;
    }

    return {
        id: code,
        label: "Customer Information Form",
        locationName: "Main Location",
        businessName: "Sample Business",
        formFields: [
            {
                name: "name",
                label: "Full Name",
                type: "text",
                required: true,
                placeholder: "Enter your full name"
            },
            {
                name: "email",
                label: "Email Address",
                type: "email",
                required: true,
                placeholder: "Enter your email address"
            },
            {
                name: "phone",
                label: "Phone Number",
                type: "tel",
                required: false,
                placeholder: "Enter your phone number"
            },
            {
                name: "interests",
                label: "What are you interested in?",
                type: "select",
                required: false,
                options: [
                    { value: "products", label: "Products" },
                    { value: "services", label: "Services" },
                    { value: "support", label: "Support" },
                    { value: "other", label: "Other" }
                ]
            },
            {
                name: "message",
                label: "Additional Message",
                type: "textarea",
                required: false,
                placeholder: "Any additional information or questions?"
            }
        ],
        destinationUrl: "/thank-you"
    };
}

export default async function QRCodePage({ params }: QRPageProps) {
    const qrData = await getQRCodeData(params.code);

    if (!qrData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {qrData.businessName}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {qrData.locationName}
                        </p>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Please fill out the form below to get in touch with us
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            {qrData.label}
                        </h2>
                        
                        <QRFormCapture 
                            qrCodeId={qrData.id}
                            formFields={qrData.formFields}
                            destinationUrl={qrData.destinationUrl}
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Powered by BizPulse</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
