import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: NextRequest) {
	await dbConnect();
	try {
        const {searchParams} = new URL(request.url);
        const queryParam ={ 
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);
        if (!result.success) {
            const error = result.error.format().username?._errors || [];
            return NextResponse.json(
                { success: false, message: error?.length > 0 && error.join(", ") || "Invalid query params" },
                { status: 400 }
            );
        }

        const {username } =result?.data
        const existingVerifiedUser = await UserModel.findOne({ username,isVerified: true });
        if (existingVerifiedUser){
            return NextResponse.json(
                { success: false, message: "Username is already taken" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Username is available" },
            { status: 200 }
        );

	} catch (error) {
		console.log("Error while checking if username is unique", error);
		return NextResponse.json(
			{ success: false, message: "Error while checking if username is unique" },
			{ status: 500 }
		);
	}
}
