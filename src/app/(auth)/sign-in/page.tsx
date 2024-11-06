"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
export default function page() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});
	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials",{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })
    if (result?.error) {
      toast({
        title:"Login Failed",
        description:"Invalid Credentials",
        variant:"destructive"
      })
    }
    if (result?.url) {
      router.replace("/dashboard")
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
							name="identifier"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Identifier</FormLabel>
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
								"Sign In"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not Registered yet?{" "}
						<Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
