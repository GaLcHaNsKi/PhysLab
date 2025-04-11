import { z } from "zod"

export const JoiningTokenSchema = z.object({
    laboratoryId: z.number().int(),
    roleId: z.number().int(),
    workTime: z.number().int().min(1).max(24).optional().default(1)
})