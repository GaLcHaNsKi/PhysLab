import { Hono } from "hono"
import { MiddlewareVariables } from ".."
import { validator } from "hono/validator"
import { LaboratoryCreateSchema, LaboratoryEditSchema, LaboratoryListSchema } from "./laboratories.shema"
import { checkPermission, createLaboratory, editLaboratory, getAllPublicLaboratoriesList, deleteLaboratory } from "./laboratories.service"

export const laboratoriesRoute = new Hono<{ Variables: MiddlewareVariables }>()

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

            return c.json(lab, 200)
        } catch(e: any) {
            if (e.code === "P2002") return c.json({ error: "This laboratory name is busy" }, 409)
            else console.error(e)

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

laboratoriesRoute.get("/",
    validator('query', (value, c) => {
        const parsed = LaboratoryListSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        let { page, limit } = c.req.valid("query")

        try {
            const laboratories = await getAllPublicLaboratoriesList(page, limit)
            
            return c.json(laboratories, 200)
        } catch(e: any) {
            console.error(e)

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

laboratoriesRoute.delete("/:id", async (c) => {
    const laboratoryId = parseInt(c.req.param("id"))
    if (isNaN(laboratoryId)) return c.text("Invalid laboratory id", 400)
    
    const userId = c.get("user").id

    try {
        if (!await checkPermission(laboratoryId, "delete_laboratory", userId)) return c.json({ error: "You don't have permission to delete laboratory" }, 403)

        const laboratory = await deleteLaboratory(laboratoryId)

        if (!laboratory) return c.json({ error: "Laboratory not found" }, 404)

        return c.json({ message: "Laboratory deleted" }, 200)
    } catch(e: any) {
        console.error(e)

        return c.json({ error: "Internal server error" }, 500)
    }
})