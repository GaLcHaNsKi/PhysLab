import { z } from "zod";

export const ParticipantsGetOneSchema = z.object({
    userId: z.coerce.number().int().min(1),
    labId: z.coerce.number().int().min(1)
})

export const ParticipantsSetRoleSchema = z.object({
    userId: z.coerce.number().int().min(1),
    labId: z.coerce.number().int().min(1),
    roleId: z.coerce.number().int().min(1)
})

export const ParticipantsFilterSchema = z.object({
    roleId: z.coerce.number().int().min(1).optional(),
    nickname: z.string().optional(),
    surname: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    email: z.string().email().optional()
})
export type ParticipantsFilterSchemaType = z.infer<typeof ParticipantsFilterSchema>