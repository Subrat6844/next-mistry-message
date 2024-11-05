// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import React, { useState } from "react";
// import { useDebounceValue } from "usehooks-ts";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { signInSchema } from "@/schema/signInSchema";

// export default function page() {
// 	const [username, setUsername] = useState("");
// 	const [usernameMessage, setUsernameMessage] = useState("");
// 	const [isCheckingUsername, setIsCheckingUsername] = useState(false);

// 	const debouncedUsername = useDebounceValue(username, 300);
// 	const { toast } = useToast();
// 	const router = useRouter();
//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues:{
//       identifier: "",
//       password: "",
//     }
//   })
// 	return(
//     <>
//     </>
//     );
// }
import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
