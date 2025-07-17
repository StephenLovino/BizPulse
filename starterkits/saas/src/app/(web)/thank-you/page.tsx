import { type Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Thank You - BizPulse",
    description: "Thank you for submitting your information",
};

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-md text-center">
                    <div className="mb-6 flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Thank You!
                    </h1>
                    
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                        Your information has been submitted successfully. We'll be in touch with you soon!
                    </p>
                    
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/">
                                Return to Home
                            </Link>
                        </Button>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Powered by BizPulse
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
