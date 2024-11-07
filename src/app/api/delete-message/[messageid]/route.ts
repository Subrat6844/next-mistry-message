import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/models/User";
export async function DELETE(
	request: Request,
	{ params }: { params: { messageid: string } }
) {
	await dbConnect();
	const { messageid } = params;
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

	try {
		const updateResult = await UserModel.updateOne(
			{ _id: user._id },
			{ $pull: { messages: { _id: messageid } } }
		);

		if (updateResult.modifiedCount === 0) {
			return Response.json(
				{
					success: false,
					message: "Message not found or already deleted",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Message deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error while deleting message", error);

		return Response.json(
			{
				success: false,
				message: "Failed to delete message",
			},
			{ status: 500 }
		);
	}
}