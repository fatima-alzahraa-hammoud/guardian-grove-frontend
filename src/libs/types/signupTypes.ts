import { z } from 'zod';

export const firstStepSchema = z.object({
    name: z.string().min(3),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character" }),
    confirmPassword: z.string(),
}).refine(data => {data.password === data.confirmPassword}, {
    message: "Passwords do not match", 
    path: ["confirmPassword"]
});

export type TFirstStep = z.infer<typeof firstStepSchema>;