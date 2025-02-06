import { z } from "zod";

const signUpSchema = z.object({
    username:z.string().min(3),
    password: z.string(),
    name: z.string(),
});
const signInSchema = z.object({
    username:z.string().min(3),
    password: z.string(),
});
const roomSchema = z.object({
    roomName:z.string().min(3),
});

export{
    signInSchema,signUpSchema,roomSchema
}