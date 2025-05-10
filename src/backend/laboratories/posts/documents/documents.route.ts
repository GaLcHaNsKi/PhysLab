import { Hono } from "hono";
import { MiddlewareVariables } from "../../../..";
import { createFileAndUpload, deleteFileById, getAllDocuments, getFileById } from "./documents.service";
import { errorAnswer, successAnswer, undefinedAnswer } from "../../../../answers";

export const documentRoute = new Hono<{ Variables: MiddlewareVariables}>()

// get list of documents
documentRoute.get("/", async (c) => {
    const postId = c.req.param("postId")

    if (!postId) {
        return c.json({ error: "postId is required" }, 400)
    }
    if (isNaN(+postId)) {
        return c.json(undefinedAnswer, 404)
    }

    try {
        const docs = await getAllDocuments(+postId)
        
        return c.json(docs, 200)
    } catch (error) {
        console.error(error)

        return c.json(errorAnswer, 500)
    }
})
// get document by id

// upload document
documentRoute.post("/", async (c) => {
    const postId = c.req.param("postId")

    if (!postId) {
        return c.json({ error: "postId is required" }, 400)
    }
    if (isNaN(+postId)) {
        return c.json(undefinedAnswer, 404)
    }

    const file = (await c.req.parseBody())["file"] as File
    if (!file) {
        return c.json({ error: "file is required" }, 400)
    }

    try {
        const res = await createFileAndUpload(+postId, c.get("user").id, file)
        if (res.status !== 200) return c.json({ error: `Error uploading file: ${res.status}` }, 500)

        return c.json(successAnswer, 200)
    } catch (e: any) {
        if (e === "Post not found") return c.json({ error: e }, 404)
        else if (e === "File cannot be empty!") return c.json({ error: e }, 400)
        else console.error(e)

        return c.json(errorAnswer, 500)
    }
})

// get document by id
documentRoute.get("/:id", async (c) => {
    const fileId = c.req.param("id")

    if (!fileId) {
        return c.json({ error: "fileId is required" }, 400)
    }
    if (isNaN(+fileId)) {
        return c.json(undefinedAnswer, 404)
    }

    try {
        const file = await getFileById(+fileId)
        if (!file) return c.json(undefinedAnswer, 404)

        return c.json(file, 200)
    } catch (e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})

// delete document by id
documentRoute.delete("/:id", async (c) => {
    const fileId = c.req.param("id")

    if (!fileId) {
        return c.json({ error: "fileId is required" }, 400)
    }
    if (isNaN(+fileId)) {
        return c.json(undefinedAnswer, 404)
    }

    try {
        const file = await deleteFileById(+fileId)
        if (!file) return c.json(undefinedAnswer, 404)

        return c.json(successAnswer, 200)
    } catch (e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})