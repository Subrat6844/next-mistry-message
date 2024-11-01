import { z } from "zod";

export const messageSchema = z.object({
	content: z
		.string()
		.min(6, { message: "Accept Message must be 6 characters long" })
		.max(300, {message: "Accept Message cannot be longer than 300 characters",}),
});