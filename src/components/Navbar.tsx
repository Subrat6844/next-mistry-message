"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Button } from "./ui/button";
export default function Navbar() {
	const { data: session } = useSession();
	const user: User = session?.user as User;
	return (
		<nav className="px-4 md:px-6 py-2 md:py-4 shadow-md bg-gray-900 text-white">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<a href="#" className="text-xl font-bold mb-4 md:mb-0">
					True Feedback
				</a>
				{session ? (
					<>
						<span className="mr-4">Welcome, {user?.username || user?.email}</span>
						<Button
							onClick={() => signOut()}
							variant="destructive"
						>
							Logout
						</Button>
					</>
				) : (
					<Link href="/sign-in">
						<Button
							className="w-full md:w-auto bg-slate-100 text-black"
							variant={"outline"}
						>
							Login
						</Button>
					</Link>
				)}
			</div>
		</nav>
	);
}
