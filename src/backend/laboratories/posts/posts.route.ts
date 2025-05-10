import { Hono } from "hono";
import { MiddlewareVariables } from "../../..";
import { LaboratoryPaginationSchema } from "../laboratories.shema";
import { validator } from "hono/validator";
import { errorAnswer, LabWorkDataNotProvided, successAnswer, undefinedAnswer } from "../../../answers";
import { createPost, deletePost, editPost, getAllPosts, getPostById } from "./posts.service";
import { PostCreateSchema, PostEditSchema, PostsFilterSchema } from "./posts.schema";
import { checkPermission } from "../laboratories.service";
import { documentRoute } from "./documents/documents.route";
import { commentsRoute } from "./comments/comments.route";

export const postsRoute = new Hono<{ Variables: MiddlewareVariables}>()

postsRoute.route("/:postId/documents", documentRoute)
postsRoute.route("/:postId/comments", commentsRoute)

postsRoute.post("/get-all",
    validator('query', (value, c) => {
        const laboratoryId = c.req.param("labId")
        const parsed = LaboratoryPaginationSchema.safeParse({ ...value, laboratoryId: laboratoryId? +laboratoryId : undefined })
        if (!parsed.success) return c.json({ error: parsed.error.message }, 400)

        return parsed.data
    }),
    validator('json', (value, c) => {
        const parsed = PostsFilterSchema.safeParse(value)
        if (!parsed.success) return c.json({ error: parsed.error.message }, 400)

        return parsed.data
    }),
    async (c) => {
        const { laboratoryId, page, take } = c.req.valid("query")
        const isSelf = c.req.query("isSelf") === "true"
        const isLabWork = c.req.query("isLabWork")
        const filter = c.req.valid("json")

        if (isSelf) if (!filter.authorNickname) filter.authorNickname = c.get("user").nickname
        
        if (isLabWork === "true") {
            const { course, semester } = c.req.valid("json")
            if (!course || !semester) return c.json(LabWorkDataNotProvided, 400)
        }

        try {
            const posts = await getAllPosts(laboratoryId, page, take, filter, isSelf)

            return c.json(posts)
        } catch (e: any) {
            console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

postsRoute.get("/:postId", async (c) => {
    const postId = c.req.param("postId")
    const laboratoryId = c.req.param("labId")
    const isLabWork = c.req.query("isLabWork") === "true"

    if (!postId || !laboratoryId) return c.json(undefinedAnswer, 404)
    if (isNaN(+postId) || isNaN(+laboratoryId)) return c.json(undefinedAnswer, 404)

    try {
        const post = await getPostById(+postId, +laboratoryId, isLabWork)
        if (!post) return c.json(undefinedAnswer, 404)

        return c.json(post, 200)
    } catch(e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})

postsRoute.post("/create",
    validator('json', (value, c) => {
        const laboratoryId = c.req.param("labId")
        const parsed = PostCreateSchema.safeParse({ ...value, labId: laboratoryId? +laboratoryId : undefined })
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const data = c.req.valid("json")
        
        const isLabWork = c.req.query("isLabWork") === "true"
        if (isLabWork) {
            const { course, semester } = c.req.valid("json")
            if (!course || !semester) return c.json(LabWorkDataNotProvided, 400)
        }

        try {
            if (!await checkPermission(data.labId, "create_post", c.get("user").id)) return c.json({ message: "You don't have permission to create posts in this laboratory!" }, 403)
            const post = await createPost(c.get("user").id, data, isLabWork)

            return c.json(post, 200)
        } catch(e: any) {
            if (e === "Laboratory work not found") return c.json(undefinedAnswer, 404)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

postsRoute.put("/:postId",
    validator('json', (value, c) => {
        const laboratoryId = c.req.param("labId")
        const postId = c.req.param("postId")

        const parsed = PostEditSchema.safeParse({ ...value, labId: laboratoryId? +laboratoryId : undefined, postId })
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const data = c.req.valid("json")
        const isLabWork = c.req.query("isLabWork") === "true"

        try {
            if (!await checkPermission(data.labId, "create_post", c.get("user").id)) return c.json({ message: "You don't have permission to edit this post!" }, 403)
            const isEditUnownedPost = await checkPermission(data.labId, "edit_unowned_posts", c.get("user").id)

            const post = await editPost(data, c.get("user").id, isEditUnownedPost, isLabWork)

            return c.json(successAnswer, 200)
        } catch(e: any) {
            if (e === "Post not found") return c.json(undefinedAnswer, 404)
            else if (e === "You don't have permission to edit this post!") return c.json({ error: e }, 403)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

postsRoute.delete("/:postId", async (c) => {
    const postId = c.req.param("postId")
    const laboratoryId = c.req.param("labId")

    if (!postId || !laboratoryId) return c.json(undefinedAnswer, 404)
    if (isNaN(+postId) || isNaN(+laboratoryId)) return c.json(undefinedAnswer, 404)

    try {
        const post = await deletePost(+postId, +laboratoryId, c.get("user").id)

        return c.json(successAnswer, 200)
    } catch(e: any) {
        if (e === "Post not found") return c.json(undefinedAnswer, 404)
        else if (e === "You don't have permission to delete this post!") return c.json({ error: e }, 403)
        else console.error(e)

        return c.json(errorAnswer, 500)
    }
})