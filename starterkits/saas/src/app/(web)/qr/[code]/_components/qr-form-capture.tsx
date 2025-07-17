"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "select" | "textarea";
    required: boolean;
    placeholder?: string;
    options?: { value: string; label: string; }[];
}

interface QRFormCaptureProps {
    qrCodeId: string;
    formFields: FormField[];
    destinationUrl?: string;
}

export function QRFormCapture({ qrCodeId, formFields, destinationUrl }: QRFormCaptureProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            const missingFields = formFields
                .filter(field => field.required && !formData[field.name])
                .map(field => field.label);

            if (missingFields.length > 0) {
                toast.error(`Please fill in required fields: ${missingFields.join(", ")}`);
                setIsSubmitting(false);
                return;
            }

            // Submit form data
            const response = await fetch("/api/qr/capture", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    qrCodeId,
                    formData,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            toast.success("Thank you! Your information has been submitted successfully.");
            
            // Redirect to destination URL or thank you page
            if (destinationUrl) {
                router.push(destinationUrl);
            } else {
                router.push("/thank-you");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("There was an error submitting your information. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            required: field.required,
            value: formData[field.name] || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                handleInputChange(field.name, e.target.value),
        };

        switch (field.type) {
            case "text":
            case "email":
            case "tel":
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        placeholder={field.placeholder}
                    />
                );

            case "textarea":
                return (
                    <Textarea
                        {...commonProps}
                        placeholder={field.placeholder}
                        rows={4}
                    />
                );

            case "select":
                return (
                    <Select
                        value={formData[field.name] || ""}
                        onValueChange={(value) => handleInputChange(field.name, value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                </div>
            ))}

            <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit"
                )}
            </Button>
        </form>
    );
}
