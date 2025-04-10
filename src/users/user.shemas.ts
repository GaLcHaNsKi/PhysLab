import { z } from "zod"

export const UserEditSchema = z.object({
    nickname: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).max(20).optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    aboutMe: z.string().optional()
})

export type UserEditShemaType = z.infer<typeof UserEditSchema>