import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	otp: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({ username, otp }),
        });
        return {success: true, message: "Verification email sent successfully"}
    } catch (error) {
        console.log("Error while sending verification email",error);
        return {success: false, message: "Error while sending verification email"}
    }
}
