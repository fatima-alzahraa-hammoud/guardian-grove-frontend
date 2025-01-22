import { z } from 'zod';

export const loginSchema = z.object({
    name: z.string().min(3),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    password: z.string(),
});

export type TLogin = z.infer<typeof loginSchema>;