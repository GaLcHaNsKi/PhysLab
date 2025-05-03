import { z } from "zod"

export const LaboratoryCreateSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"])
})

export const LaboratoryEditSchema = z.object({
    id: z.coerce.number().int(),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).optional()
})

export const LaboratoryListSchema = z.object({
    page: z.coerce.number().int().optional().default(1),
    limit: z.coerce.number().int().optional().default(10)
})

export const LaboratoryPaginationSchema = z.object({
    laboratoryId: z.number().int("Laboratory ID must be integer"),
    page: z.coerce.number().int().min(1).optional().default(1),
    take: z.coerce.number().int().min(1).optional().default(10)
})

export const LaboratoryFilterSchema = z.object({
    name: z.string().max(100).optional(),
    authorNickname: z.string().max(100).optional()
})

export type LaboratoryCreateSchemaType = z.infer<typeof LaboratoryCreateSchema>
export type LaboratoryEditSchemaType = z.infer<typeof LaboratoryEditSchema>
export type LaboratoryFilterSchemaType = z.infer<typeof LaboratoryFilterSchema>