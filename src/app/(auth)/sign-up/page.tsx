"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Cross, Loader2Icon } from "lucide-react";
export default function page() {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const debounced = useDebounceCallback(setUsername, 500);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsername = async () => {
			if (username.length > 0) {
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);
					if (response.data.success) {
						setUsernameMessage(response.data.message);
					}
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message || "Error while checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		checkUsername();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);
		console.log(data);
		try {
			const response = await axios.post("/api/sign-up", data);
			if (response.data.success) {
				toast({
					title: "Account created",
					description: response.data.message,
				});
				setTimeout(() => {
					router.push(`/verify/${username}`);
				}, 1000);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Sign up Failed",
				description:
					axiosError.response?.data.message || "Error while creating account",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800 ">
			<div className="w-full max-w-md bg-white text-black p-8 space-y-8 rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
											}}
										/>
									</FormControl>
									{isCheckingUsername && (
										<Loader2Icon className="animate-spin" />
									)}
									{!isCheckingUsername && username.length > 0 && usernameMessage && (
										<p
											className={`text-sm ${
												usernameMessage === "Username is available"
													? "text-green-600"
													: "text-destructive"
											}`}
										>
											{usernameMessage === "Username is available" ? (
												<Check className="inline w-4 h-4 mr-2" />
											) : (
												<Cross className="inline w-4 h-4 mr-2" />
											)}
											{usernameMessage}
										</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" {...field} placeholder="xyz@example.com" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} placeholder="********" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting} className="w-full " type="submit">
							{isSubmitting ? (
								<>
									<Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> "Please
									wait"
								</>
							) : (
								"Sign up"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
