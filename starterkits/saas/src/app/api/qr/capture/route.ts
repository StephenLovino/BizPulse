import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrCodeId, formData } = body;

        if (!qrCodeId || !formData) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // First, get the QR code details to find the location
        const { data: qrCode, error: qrError } = await supabase
            .from("qr_codes")
            .select("location_id")
            .eq("id", qrCodeId)
            .single();

        if (qrError || !qrCode) {
            return NextResponse.json(
                { error: "QR code not found" },
                { status: 404 }
            );
        }

        // Create customer record
        const customerData = {
            location_id: qrCode.location_id,
            name: formData.name || null,
            email: formData.email || null,
            phone: formData.phone || null,
            source: "qr" as const,
        };

        const { data: customer, error: customerError } = await supabase
            .from("customers")
            .insert(customerData)
            .select()
            .single();

        if (customerError) {
            console.error("Error creating customer:", customerError);
            return NextResponse.json(
                { error: "Failed to save customer information" },
                { status: 500 }
            );
        }

        // TODO: Trigger any automations for this location
        // This would involve checking for active automations and executing them

        return NextResponse.json({
            success: true,
            customerId: customer.id,
        });

    } catch (error) {
        console.error("QR capture error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
