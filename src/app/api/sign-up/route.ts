import { dbConnect } from "@/lib/dbConnect";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	await dbConnect();
	const otp = String(Math.floor(100000 + Math.random() * 900000));
	const { email, password, username } = await req.json();
	console.log(email, password, username);

	try {
		const existingVerifiedUserByUsername = await User.findOne({
			username,
			isVerified: true,
		});
		if (existingVerifiedUserByUsername) {
			return NextResponse.json(
				{ success: false, message: "Username is already taken" },
				{ status: 400 }
			);
		}

		const userExistsByEmail = await User.findOne({ email });
		if (userExistsByEmail) {
			if (userExistsByEmail.isVerified) {
				return NextResponse.json(
					{ success: false, message: "User already exists with this Email" },
					{ status: 400 }
				);
			} else {
				const hashedPassword = await bcryptjs.hash(password, 10);
				const expiryDate = new Date();
				expiryDate.setHours(expiryDate.getHours() + 1);
				userExistsByEmail.password = hashedPassword;
				userExistsByEmail.username = username;
				userExistsByEmail.verifyCode = otp;
				userExistsByEmail.verifyCodeExpiry = expiryDate;
				await userExistsByEmail.save();
			}
		} else {
			const hashedPassword = await bcryptjs.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);
			const user = new User({
				username,
				email,
				password: hashedPassword,
				verifyCode: otp,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessage: true,
				messages: [],
			});
			await user.save();
		}

		const emailResponse = await sendVerificationEmail(email, username, otp);
		console.log("emailResponse", emailResponse);
		if (!emailResponse.success) {
			return NextResponse.json(
				{ success: false, message: emailResponse.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ success: true, message: "User created successfully please verify your email" },
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error while signing up", error);
		return NextResponse.json(
			{ success: false, message: "Error while signing up" },
			{ status: 500 }
		);
	}
}
