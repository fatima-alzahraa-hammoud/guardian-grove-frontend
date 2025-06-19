import { z } from 'zod';

export const updateSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().regex(/^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
    avatar: z.string().nonempty({ message: "Avatar is required." }),
    birthday: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.string().nonempty({ message: "Gender is required." }),
    familyName: z.string().min(3, { message: "Family name is required" }),
    familyAvatar: z.string().nonempty({ message: "Family Avatar is required." }),
});

export type TUpdate = z.infer<typeof updateSchema>;