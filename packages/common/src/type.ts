import {z} from 'zod';

export const signUpSchema = z.object({
    username:z.string().min(3),
    password: z.string(),
    name: z.string(),
});

export const signInSchema = z.object({
    username:z.string().min(3),
    password: z.string(),
});
export const roomSchema = z.object({
    roomName:z.string().min(3),
});
