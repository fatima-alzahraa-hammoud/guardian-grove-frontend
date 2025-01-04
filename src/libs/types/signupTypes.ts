import { z } from 'zod';

export const firstStepSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character" }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match", 
    path: ["confirmPassword"]
});

export type TFirstStep = z.infer<typeof firstStepSchema>;

export const secondStepSchems = z.object({
    avatar: z.string().nonempty({ message: "Avatar is required." }),
    date: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.string().nonempty({ message: "Gender is required." }),
    familyMember: z.string().nonempty({ message: "Family member type is required." }),
    interests: z.array(z.string()).nonempty({ message: "At least one interest is required." }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the Terms and Conditions and Privacy Policy",
    }),
});

export type TSecondStep = z.infer<typeof secondStepSchems>;
