import { Semester } from ".prisma/client";
import { z } from "zod";

export const PostsFilterSchema = z.object({
    title: z.string().optional(),
    authorNickname: z.string().optional(),
    tags: z.string().array().optional(),
    course: z.coerce.number().int().min(1).max(4).optional(),
    semester: z.enum([Semester.AUTUMN, Semester.SPRING]).optional()
})

export const PostCreateSchema = z.object({
    labId: z.coerce.number().int().min(1),
    title: z.string(),
    text: z.string(),
    tags: z.string().array().optional(),
    course: z.coerce.number().int().min(1).max(4).optional(),
    semester: z.enum([Semester.AUTUMN, Semester.SPRING]).optional(),
    simLink: z.string().optional()
})

export const PostEditSchema = z.object({
    labId: z.coerce.number().int().min(1),
    postId: z.coerce.number().int().min(1),
    title: z.string().optional(),
    text: z.string().optional(),
    tags: z.string().array().optional(),
    course: z.coerce.number().int().min(1).max(4).optional(),
    semester: z.enum([Semester.AUTUMN, Semester.SPRING]).optional(),
    simLink: z.string().optional()
})

export type PostsFilterSchemaType = z.infer<typeof PostsFilterSchema>
export type PostCreateSchemaType = z.infer<typeof PostCreateSchema>
export type PostEditSchemaType = z.infer<typeof PostEditSchema>