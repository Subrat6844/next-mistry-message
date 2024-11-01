import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")

export const emailValidation = z
    .string()
    .email("Invalid email address")