import { z } from 'zod';

export const loginSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().min(1, "Email is required").regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    password: z.string().min(1, "Password is required"),
});

export type TLogin = z.infer<typeof loginSchema>;