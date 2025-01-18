import { z } from 'zod';

export const addMemberSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    avatar: z.string().nonempty({ message: "Avatar is required." }),
    birthday: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.enum(["male", "female"], {
        required_error: "Gender is required.",
    }),
    interests: z.array(z.string()).min(1, { message: "At least one interest is required." }),
    role: z.enum(["child", "parent"], {
        required_error: "Family member type is required.",
    }),
});

export type TAddMember = z.infer<typeof addMemberSchema>;
