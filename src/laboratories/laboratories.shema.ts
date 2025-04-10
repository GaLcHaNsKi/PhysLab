import { z } from "zod"

export const LaboratoryCreateSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"])
})

export const LaboratoryEditSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).optional()
})

export const LaboratoryListSchema = z.object({
    page: z.number().int().optional().default(1),
    limit: z.number().int().optional().default(10)
})

export type LaboratoryCreateSchemaType = z.infer<typeof LaboratoryCreateSchema>
export type LaboratoryEditSchemaType = z.infer<typeof LaboratoryEditSchema>