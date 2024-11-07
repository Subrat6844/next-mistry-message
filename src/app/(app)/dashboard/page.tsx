"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const { toast } = useToast();
	const handleDeleteMessage = (messageId: string) => {
		setMessages((prev) => prev.filter((message) => message._id !== messageId));
	};
	const { data: session } = useSession();
	const form = useForm({
		resolver: zodResolver(acceptMessageSchema),
	});
	const { register, watch, handleSubmit, setValue } = form;

	const acceptMessages = watch("acceptMessages");
	const fetchAcceptingMessage = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get("/api/accept-message");
			setValue("acceptMessages", response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ||
					"Error while fetching isAcceptingMessages",
				variant: "destructive",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue,toast]);

	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			setIsLoading(true);
			setIsSwitchLoading(true);
			try {
				const response = await axios.get("/api/get-messages");
				setMessages(response.data.messages || []);
				if (refresh) {
					toast({
						title: "Success : Messages Refreshed",
						description: "Showing latest messages",
					});
				} else {
					toast({
						title: "Success : Messages Fetched",
						description: "Showing all messages",
					});
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast({
					title: "Error",
					description:
						axiosError.response?.data.message ||
						"Error while fetching messages",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
				setIsSwitchLoading(false);
			}
		},
		[setIsLoading, setMessages,toast]
	);
	useEffect(() => {
		if (!session || !session?.user) {
			return;
		}
		fetchMessages();
		
		fetchAcceptingMessage();
	}, [setValue, toast, fetchAcceptingMessage, fetchMessages]);
	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>("/api/accept-message", {
				acceptMessage: !acceptMessages,
			});
			setValue("acceptMessages", !acceptMessages);
			toast({
				title: "Success",
				description: response.data.message,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ||
					"Error while toggling accept-messages",
				variant: "destructive",
			});
		}
	};
	const user = session?.user as User;
	const baseUrl = `${window.location.protocol}//${window.location.host}`;
	const profileUrl = `${baseUrl}/u/${user?.username}`;
	if (!session || !session?.user) {
		return <div>Unauthorized : Please Login</div>;
	}
	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast({
			title: "URL Copied",
			description: "Profile URL has been copied",
		});
	};
	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
			<div className="mb-4">
				<h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
				<div className="flex items-center">
					<input
						type="text"
						value={profileUrl}
						disabled
						className="input input-bordered w-full p-2 mr-2"
					/>
					<Button onClick={copyToClipboard}>Copy</Button>
				</div>
			</div>
			<div className="mb-4">
				<Switch
					{...register("acceptMessages")}
					checked={acceptMessages}
					onCheckedChange={handleSwitchChange}
					disabled={isSwitchLoading}
				/>
				<span className="ml-2">
					Accept Messages: {acceptMessages ? "On" : "Off"}
				</span>
			</div>
			<Separator />
			<Button
				className="mt-4"
				variant="outline"
				onClick={(e) => {
					e.preventDefault();
					fetchMessages(true);
				}}
			>
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCcw className="h-4 w-4" />
				)}
			</Button>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				{messages.length > 0 ? (
					messages.map((message, index) => (
						<MessageCard
							key={index}
							message={message}
							onDeleteMessage={handleDeleteMessage}
						/>
					))
				) : (
					<p>No messages to display.</p>
				)}
			</div>
		</div>
	);
}
