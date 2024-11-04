import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
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
	const userId = new mongoose.Types.ObjectId(user._id);
	try {
		const user = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);
		if (!user || user.length === 0) {
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
				messages: user[0].messages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error while getting messages", error);
		return Response.json(
			{
				success: false,
				message: "Error while getting messages",
			},
			{ status: 500 }
		);
	}
}
