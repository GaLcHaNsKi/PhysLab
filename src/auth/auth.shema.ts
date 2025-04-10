import { z } from 'zod'

export const SignUpSchema = z.object({
    nickname: z.string().min(1, "Nickname is required!"),
    email: z.string().email("Invalid email!"),
    password: z.string().min(8, "Password is required").max(20, "Password must be at most 20 characters long!"),
    name: z.string().optional(),
    surname: z.string().optional(),
    aboutMe: z.string().optional()
})

export const SignInSchema = z.object({
    nickname: z.string().min(1, "Nickname is required!"),
    password: z.string().min(8, "Password is required").max(20, "Password must be at most 20 characters long!"),
})

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
export type SignInSchemaType = z.infer<typeof SignInSchema>