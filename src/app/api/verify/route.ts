import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	await dbConnect();
	try {
		const { username, code } = await request.json();
		const decodedUsername = decodeURIComponent(username);
		const user = await UserModel.findOne({ username: decodedUsername });
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not Found" },
				{ status: 400 }
			);
		}
		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return NextResponse.json(
				{
					success: true,
					message: "Email verified successfully",
				},
				{ status: 200 }
			);
		} else if (!isCodeNotExpired) {
			return NextResponse.json(
				{
					success: false,
					message: "Code Expired Please sign up again to get a new code",
				},
				{ status: 400 }
			);
		}else{
            return NextResponse.json(
				{
					success: false,
					message: "Invalid Verification Code",
				},
				{ status: 400 }
			);
        }
	} catch (error) {
		console.log("Error while verifying email", error);
		return NextResponse.json(
			{ success: false, message: "Error while verifying email" },
			{ status: 500 }
		);
	}
}
