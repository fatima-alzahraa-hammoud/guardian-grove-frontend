import { z } from 'zod';

export const firstStepSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().min(1, "Email is required").regex(/^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character" }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match", 
    path: ["confirmPassword"]
});

export type TFirstStep = z.infer<typeof firstStepSchema>;

export const secondStepSchems = z.object({
    avatar: z.union([
        z.string().min(1, { message: "Avatar is required." }),
        z.instanceof(File, { message: "Avatar is required." }),
        z.any() // For blob URLs
    ]).refine((val) => {
        if (typeof val === 'string') return val.length > 0;
        if (val instanceof File) return true;
        if (typeof val === 'string' && val.startsWith('blob:')) return true;
        return false;
    }, { message: "Avatar is required." }),
    
    birthday: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.string().nonempty({ message: "Gender is required." }),
    role: z.string().nonempty({ message: "Family member type is required." }),
    interests: z.array(z.string()).min(1, { message: "At least one interest is required." }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the Terms and Conditions and Privacy Policy",
    }),
    familyName: z.string().min(3, { message: "Family name is required" }),
    
    familyAvatar: z.union([
        z.string().min(1, { message: "Family Avatar is required." }),
        z.instanceof(File, { message: "Family Avatar is required." }),
        z.any() // For blob URLs
    ]).refine((val) => {
        if (typeof val === 'string') return val.length > 0;
        if (val instanceof File) return true;
        if (typeof val === 'string' && val.startsWith('blob:')) return true;
        return false;
    }, { message: "Family Avatar is required." }),
});

export type TSecondStep = z.infer<typeof secondStepSchems>;