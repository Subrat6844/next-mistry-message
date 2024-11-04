import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import UserModel from "@/models/User";
import { User } from "next-auth";
export async function POST(request: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const user = session?.user as User;
	if (!session || !session?.user) {
		return Response.json(
			{
				success: false,
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}
	const userId = user._id;
	const { acceptMessage } = await request.json();
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessage: acceptMessage },
			{ new: true }
		);
		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "failed to toggle accept-messages",
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "toggle accept-messages success",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "Failed to toggle accept-messages",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user = session?.user as User;
	if (!session || !session?.user) {
		return Response.json(
			{
				success: false,
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}
	const userId = user._id;
	try {
		const foundUser = await UserModel.findById(userId);
		if (!foundUser) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}
		return Response.json(
			{
				success: true,
				message: foundUser.isAcceptingMessage,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "Failed to get accept-messages status",
			},
			{ status: 500 }
		);
	}
}
