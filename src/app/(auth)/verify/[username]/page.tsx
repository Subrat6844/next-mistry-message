"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schema/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function VerifyAccount() {
	const router = useRouter();
	const param = useParams<{ username: string }>();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
		defaultValues: {
			verifyCode: "",
		},
	});
	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const result = await axios.post("/api/verify", {
				username: param.username,
				code: data.verifyCode,
			});
			if (result.data.success) {
				router.push("/sign-in");
				toast({
					title: "Account verified",
					description: result.data.message,
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "User verification failed",
				description:
					axiosError.response?.data.message || "Error while verifying user",
				variant: "destructive",
			});
		}
	};
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 ">
			<div className="w-full max-w-md bg-white text-black p-8 space-y-8 mx-6 rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify Your Account
					</h1>
					<p className="text-xs md:text-[1rem] mb-4">Enter the Verification Code sent to your Email</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="verifyCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input type="text" {...field} placeholder="123456" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="w-full flex items-center justify-center">
							<Button disabled={form.formState.isSubmitting}>Verify Now</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
