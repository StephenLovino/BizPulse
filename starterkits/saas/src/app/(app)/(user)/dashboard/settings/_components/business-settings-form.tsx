"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const businessSettingsSchema = z.object({
    name: z.string().min(2, "Business name must be at least 2 characters"),
    industry: z.string().optional(),
    description: z.string().optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    defaultEmailTemplate: z.string().optional(),
    defaultSmsTemplate: z.string().optional(),
});

type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;

const industries = [
    "Retail",
    "Restaurant",
    "Healthcare",
    "Professional Services",
    "Real Estate",
    "Automotive",
    "Beauty & Wellness",
    "Education",
    "Technology",
    "Other",
];

export function BusinessSettingsForm() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BusinessSettingsFormData>({
        resolver: zodResolver(businessSettingsSchema),
        defaultValues: {
            name: "",
            industry: "",
            description: "",
            website: "",
            defaultEmailTemplate: "",
            defaultSmsTemplate: "",
        },
    });

    const selectedIndustry = watch("industry");

    const onSubmit = async (data: BusinessSettingsFormData) => {
        setIsLoading(true);
        try {
            // TODO: Implement API call to update business settings
            const response = await fetch("/api/business/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update business settings");
            }

            toast.success("Business settings updated successfully");
        } catch (error) {
            console.error("Error updating business settings:", error);
            toast.error("Failed to update business settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Basic Business Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Enter your business name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Select
                                    value={selectedIndustry}
                                    onValueChange={(value) => setValue("industry", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry} value={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    {...register("website")}
                                    placeholder="https://your-website.com"
                                />
                                {errors.website && (
                                    <p className="text-sm text-red-500">{errors.website.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="description">Business Description</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Describe your business..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Business Info"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Default Message Templates */}
            <Card>
                <CardHeader>
                    <CardTitle>Default Message Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="defaultEmailTemplate">Default Email Template</Label>
                        <Textarea
                            id="defaultEmailTemplate"
                            {...register("defaultEmailTemplate")}
                            placeholder="Hi {name}, thank you for your interest in our business..."
                            rows={4}
                        />
                        <p className="text-sm text-muted-foreground">
                            Use {"{name}"}, {"{email}"}, {"{phone}"} as placeholders for customer data.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="defaultSmsTemplate">Default SMS Template</Label>
                        <Textarea
                            id="defaultSmsTemplate"
                            {...register("defaultSmsTemplate")}
                            placeholder="Hi {name}, thanks for connecting with us! We'll be in touch soon."
                            rows={3}
                        />
                        <p className="text-sm text-muted-foreground">
                            Keep SMS messages under 160 characters for best delivery rates.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
