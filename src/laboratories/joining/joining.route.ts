import { Hono } from "hono";
import { MiddlewareVariables } from "../..";
import { validator } from "hono/validator";
import { JoiningTokenSchema } from "./joining.schema";
import { generateJoiningToken, joinLaboratoryByLink } from "./joining.service";

export const joiningRoute = new Hono<{ Variables: MiddlewareVariables }>()

joiningRoute.post("/:id/generate-token",
    validator('json', (value, c) => {
        const laboratoryId = c.req.param("id")
        const parsed = JoiningTokenSchema.safeParse({ ...value, laboratoryId: laboratoryId ? +laboratoryId : undefined })
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const userId = c.get("user").id

        const { laboratoryId, roleId, workTime } = c.req.valid("json")

        try {
            const token = await generateJoiningToken(laboratoryId, userId, roleId, workTime)

            return c.json(token, 200)
        } catch(e: any) {
            if (e.includes("not found") || e.includes("permission") || e.includes("root is only one user"))
                return c.json({ error: e }, 404)
            else console.error(e)

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

joiningRoute.post("/:token", async (c) => {
    const token = c.req.param("token")
    const joinerId = c.get("user").id

    try {
        const res = await joinLaboratoryByLink(token, joinerId)
        if (!res) return c.json({ error: "Error. You not joined." }, 500)
        
        return c.json({ message: "Welcome to laboratory!" }, 200)
    } catch (e: any) {
        if (e === "Invalid token") return c.json({ error: e }, 400)
        else if (e.code === "P2002") return c.json({ error: "You alredy joined to this laboratory" }, 409)
        else console.error(e)

        return c.json({ error: "Internal server error" }, 500)
    }
})