import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(req: Request) {
	await dbConnect();
	const { username, content } = await req.json();
	console.log(username, content);
	
	try {
		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}
		if (!user.isAcceptingMessage) {
			return Response.json(
				{
					success: false,
					message: "User is not accepting messages",
				},
				{ status: 401 }
			);
		}

		const newMessage = {
			content,
			createdAt: new Date(),
		};
		user.messages.push(newMessage as Message);
		await user.save();
		return Response.json(
			{
				success: true,
				message: "Message sent successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Internal server error", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
