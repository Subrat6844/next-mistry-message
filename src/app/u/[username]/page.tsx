"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
	return messageString.split(specialChar);
};
const initialMessageString =
	"'What's your favorite movie?||Do you have any pets?||What's your dream job? ' \n";
export default function page() {
	const param = useParams<{ username: string }>();
	const { username } = param;
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSuggestionLoading, setIsSuggestionLoading] = React.useState(false);
	const [suggestedMessages, setSuggestedMessages] = React.useState<string[]>(
		parseStringMessages(initialMessageString)
	);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	});
	const messageContent = form.watch("content");
	const fetchSuggestedMessages = async () => {
    setIsSuggestionLoading(true);
		try {
			const response = await axios.get("/api/suggest-messages");
      setSuggestedMessages(parseStringMessages(response.data.message));
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ||
					"Error while fetching suggested messages",
				variant: "destructive",
			});
		} finally{
      setIsSuggestionLoading(false);
    }
	};
  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      toast({
        title: "Message sent",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error while sending message",
        variant: "destructive",
      });
    } finally{
      setIsLoading(false);
    }
  };
	return (
		<div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
			<h1 className="text-4xl font-bold mb-6 text-center">
				Public Profile Link
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Send Anonymous Message to @{username}</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Write your anonymous message here"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						{isLoading ? (
							<Button disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button type="submit" disabled={isLoading || !messageContent}>
								Send It
							</Button>
						)}
					</div>
				</form>
			</Form>

			<div className="space-y-4 my-8">
				<div className="space-y-2">
					<Button type="button" onClick={fetchSuggestedMessages} disabled={isSuggestionLoading} className="my-4">
						Suggest Messages
					</Button>
					<p>Click on any message below to select it.</p>
				</div>
				<Card>
					<CardHeader>
						<h3 className="text-xl font-semibold">Messages</h3>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						{suggestedMessages.map((message, index) => (
							<Button
								key={index}
								variant="outline"
								className="mb-2"
								onClick={() => handleMessageClick(message)}
							>
								{message}
							</Button>
						))}
					</CardContent>
				</Card>
			</div>
			<Separator className="my-6" />
			<div className="text-center">
				<div className="mb-4">Get Your Message Board</div>
				<Link href={"/sign-up"}>
					<Button>Create Your Account</Button>
				</Link>
			</div>
		</div>
	);
}
