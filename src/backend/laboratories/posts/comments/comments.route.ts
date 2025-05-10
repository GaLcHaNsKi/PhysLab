import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { createCommentSchema } from './comments.schema'
import { createComment, getCommentById, getAllComments } from './comments.service'
import { errorAnswer, undefinedAnswer } from '../../../../answers'
import { MiddlewareVariables } from '../../../..'
import { checkIsUserInLaboratory, checkPermission, getLaboratoryById } from '../../laboratories.service'

export const commentsRoute = new Hono<{ Variables: MiddlewareVariables }>()

commentsRoute.post('/',
    validator('json', (value, c) => {
        const postId = c.req.param("postId")
        const labId = c.req.param("labId")
        const parsed = createCommentSchema.safeParse({ ...value, postId, labId, authorId: c.get("user").id })

        if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)

        return parsed.data
    }),
    async (c) => {
        const data = c.req.valid('json')
        try {
            if (!(await checkPermission(data.labId, "create_moderated_comment", data.authorId) || await checkPermission(data.labId, "create_comment", data.authorId)))
                return c.json({ error: "You do not have permissions to create an comment!" }, 403)

            const newComment = await createComment(data)

            return c.json(newComment, 201)
        } catch (error) {
            console.error('Error creating comment:', error)

            return c.json(errorAnswer, 500)
        }
    }
)

commentsRoute.get('/:commentId', async (c) => {
    const commentId = +c.req.param("commentId")
    if (isNaN(commentId)) return c.json(undefinedAnswer, 404)

    const labId = +(c.req.param("labId") || "")
    if (isNaN(labId)) return c.json(undefinedAnswer, 404)
    
    const lab = await getLaboratoryById(labId)
    if (lab?.visibility == "PRIVATE" && !(await checkIsUserInLaboratory(labId, c.get("user").id))) return c.json({ error: "You do not have permissions to view comments in this laboratory" }, 403)
    
    try {
        const comment = await getCommentById(commentId)

        if (!comment) {
            return c.json(undefinedAnswer, 404)
        }

        if (!comment.isModerated) {
            return c.json({ error: 'Comment is under moderation' }, 403)
        }

        return c.json(comment, 200)
    } catch (error) {
        console.error('Error fetching comment:', error)

        return c.json(errorAnswer, 500)
    }
})

commentsRoute.get('/', async (c) => {
    const postId = +(c.req.param("postId") || "a")
    if (isNaN(postId)) return c.json(undefinedAnswer, 404)

    const labId = +(c.req.param("labId") || "")
    if (isNaN(labId)) return c.json(undefinedAnswer, 404)
    
    const lab = await getLaboratoryById(labId)
    if (lab?.visibility == "PRIVATE" && !(await checkIsUserInLaboratory(labId, c.get("user").id))) return c.json({ error: "You do not have permissions to view comments in this laboratory" }, 403)
        
    try {
        const comments = await getAllComments(postId)

        return c.json(comments, 200)
    } catch (error) {
        console.error('Error fetching comments:', error)

        return c.json(errorAnswer, 500)
    }
})