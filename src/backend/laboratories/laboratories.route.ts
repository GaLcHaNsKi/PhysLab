import { Hono } from "hono"
import { validator } from "hono/validator"
import { LaboratoryCreateSchema, LaboratoryEditSchema, LaboratoryFilterSchema } from "./laboratories.shema"
import { checkPermission, createLaboratory, editLaboratory, getAllPublicLaboratoriesList, deleteLaboratory, getLaboratoryById, checkIsUserInLaboratory, getFilteredLaboratories } from "./laboratories.service"
import { joiningRoute } from "./joining/joining.route"
import { participantsRoute } from "./participants/participants.route"
import { errorAnswer, successAnswer, undefinedAnswer } from "../../answers"
import { MiddlewareVariables } from "../.."
import { postsRoute } from "./posts/posts.route"
import { getUserById, getUserIdByNickname } from "../users/user.service"

export const laboratoriesRoute = new Hono<{ Variables: MiddlewareVariables }>()

laboratoriesRoute.use("/:labId/posts/*", async (c, next) => {
    const isSelf = c.req.query("isSelf") === "true"
    if (isSelf) return next()
    
    const laboratoryId = parseInt(c.req.param("labId"))
    if (isNaN(laboratoryId)) return c.text("Invalid laboratory id", 400)
    
    const laboratory = await getLaboratoryById(laboratoryId)
    if (!laboratory) return c.json({ error: "Laboratory not found" }, 404)

    if (laboratory.visibility === "PRIVATE") {
        const userId = c.get("user").id

        if (!await checkIsUserInLaboratory(laboratoryId, userId)) return c.json({ error: "You don't have permission to view this laboratory" }, 403)
    }

    return next()
})

laboratoriesRoute.route("/:labId/joining", joiningRoute)
laboratoriesRoute.route("/:labId/participants", participantsRoute)
laboratoriesRoute.route("/:labId/posts", postsRoute)

laboratoriesRoute.post("/",
    validator('json', (value, c) => {
        const parsed = LaboratoryCreateSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const ownerId = c.get("user").id
        const data = c.req.valid("json")
        
        try {
            const lab = await createLaboratory(data, ownerId)

            return c.json(lab, 200)
        } catch(e: any) {
            if (e.code === "P2002") return c.json({ error: "This laboratory name is busy" }, 409)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

laboratoriesRoute.put("/:labId",
    validator('json', (value, c) => {
        const laboratoryId = parseInt(c.req.param("labId") || "a")
        const parsed = LaboratoryEditSchema.safeParse({ ...value, id: laboratoryId })
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const editorId = c.get("user").id
        const data = c.req.valid("json")

        if (!await checkPermission(data.id, "edit_laboratory_settings", editorId)) return c.json({ error: "You don't have permission to edit laboratory settings" }, 403)
       
        try {
            const lab = await editLaboratory(data, editorId)

            if (!lab) return c.json({ error: "Laboratory not found" }, 404)

            return c.json(successAnswer, 200)
        } catch(e: any) {
            if (e.code === "P2002") return c.json({ error: "This laboratory name is busy" }, 409)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

laboratoriesRoute.post("/get-all", 
    validator('json', (value, c) => {
        const parsed = LaboratoryFilterSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const page = parseInt(c.req.query("page") ?? "1")
        const limit = parseInt(c.req.query("limit") ?? "10")

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return c.text("Invalid pagination values", 400)
        }

        const filter = c.req.valid("json")
        try {
            const laboratories = await getFilteredLaboratories(page, limit, filter, "PUBLIC")
            
            return c.json(laboratories, 200)
        } catch(e: any) {
            console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

laboratoriesRoute.delete("/:id", async (c) => {
    const laboratoryId = parseInt(c.req.param("id"))
    if (isNaN(laboratoryId)) return c.text("Invalid laboratory id", 400)
    
    const userId = c.get("user").id

    try {
        if (!await checkPermission(laboratoryId, "delete_laboratory", userId)) return c.json({ error: "You don't have permission to delete this laboratory" }, 403)

        const laboratory = await deleteLaboratory(laboratoryId)

        if (!laboratory) return c.json({ error: "Laboratory not found" }, 404)

        return c.json({ message: "Laboratory deleted" }, 200)
    } catch(e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})

laboratoriesRoute.get("/:labId", async (c) => {
    const laboratoryId = parseInt(c.req.param("labId"))
    if (isNaN(laboratoryId)) return c.text("Invalid laboratory id", 400)
    
    try {
        const laboratory = await getLaboratoryById(laboratoryId)
        if (!laboratory) return c.json({ error: "Laboratory not found" }, 404)

        if (laboratory.visibility === "PRIVATE") {
            const userId = c.get("user").id

            if (!await checkIsUserInLaboratory(laboratoryId, userId)) return c.json({ error: "You don't have permission to view this laboratory" }, 403)
        }
        
        return c.json(laboratory, 200)
    } catch(e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})

laboratoriesRoute.get("/:labId/check-perm", async c => {
    const labId = +c.req.param("labId")
    const user = c.req.query("user")
    const perm = c.req.query("perm")

    if (!user || !perm) return c.json({ error: "userId and perm is required" }, 400)

    const userId = user==="self"? c.get("user").id : (await getUserIdByNickname(user))?.id || -1

    const result = await checkPermission(labId, perm, userId)

    return c.json(result, 200)
})