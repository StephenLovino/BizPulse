"use server";

import { resend } from "@/server/resend";
import { siteConfig } from "@/config/site";
import { siteUrls } from "@/config/urls";

interface SendVerificationEmailProps {
    email: string;
    url: string;
}

// Send a verification email to the user

export async function sendVerificationEmail({
    email,
    url,
}: SendVerificationEmailProps) {
    try {
        //send email to user via resend
        await resend.emails.send({
            from: siteConfig.noReplyEmail,
            to: email,
            subject: `Verify your email address | ${siteConfig.name}`,
            html: `
                <div>
                    <a href="${siteUrls.launchmvpfast}">${siteConfig.name}</a>
                    <h1>🪄 Your magic link</h1>
                    <p>
                        Click the link below to verify your email address and
                        sign in.
                    </p>
                    <a href="${url}">Verify your email</a>

                    <p> or </p>

                    <p>
                        Copy and paste the following link in your browser:
                        <br />
                        ${url}
                    </p>

                    <hr />
                    <p>
                        If you didn't request this email, you can ignore it.
                    </p>
                </div>`,
            text: `Click the link below to verify your email address and sign in. ${url}`,
            tags: [
                {
                    name: "category",
                    value: "confirm_email",
                },
            ],
        });
    } catch (error) {
        throw new Error("Failed to send verification email");
    }
}
