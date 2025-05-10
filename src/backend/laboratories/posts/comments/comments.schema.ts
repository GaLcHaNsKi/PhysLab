import { z } from 'zod'

export const createCommentSchema = z.object({
  text: z.string().min(1, 'Text is required').max(1000, 'Text must be 1000 characters or less'),
  authorId: z.coerce.number().int().positive('Author ID must be a positive integer'),
  postId: z.coerce.number().int().positive('Post ID must be a positive integer'),
  labId: z.coerce.number().int().positive('Lab ID must be a positive integer'),
  answerId: z.coerce.number().int().positive('Answer ID must be a positive integer').nullable().optional(),
  isModerated: z.boolean().default(true),
})

export type createCommentSchemaType = z.infer<typeof createCommentSchema>