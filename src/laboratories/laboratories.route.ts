import { Hono } from "hono"
import { MiddlewareVariables } from ".."
import { validator } from "hono/validator"
import { LaboratoryCreateSchema, LaboratoryEditSchema } from "./laboratories.shema"
import { checkPermission, createLaboratory, editLaboratory, getAllPublicLaboratoriesList, deleteLaboratory, getLaboratoryById, checkIsUserInLaboratory } from "./laboratories.service"
import { joiningRoute } from "./joining/joining.route"

export const laboratoriesRoute = new Hono<{ Variables: MiddlewareVariables }>()

laboratoriesRoute.route("/:id/joining", joiningRoute)

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

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

laboratoriesRoute.put("/",
    validator('json', (value, c) => {
        const parsed = LaboratoryEditSchema.safeParse(value)
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

            return c.text("Laboratory's info was changed!", 200)
        } catch(e: any) {
            if (e.code === "P2002") return c.json({ error: "This laboratory name is busy" }, 409)
            else console.error(e)

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

laboratoriesRoute.get("/", async (c) => {
    const page = parseInt(c.req.query("page") ?? "1")
    const limit = parseInt(c.req.query("limit") ?? "10")

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return c.text("Invalid pagination values", 400)
    }

    try {
        const laboratories = await getAllPublicLaboratoriesList(page, limit)
        
        return c.json(laboratories, 200)
    } catch(e: any) {
        console.error(e)

        return c.json({ error: "Internal server error" }, 500)
    }
})

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

        return c.json({ error: "Internal server error" }, 500)
    }
})

laboratoriesRoute.get("/:id", async (c) => {
    const laboratoryId = parseInt(c.req.param("id"))
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

        return c.json({ error: "Internal server error" }, 500)
    }

})
