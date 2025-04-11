import { Hono } from "hono";
import { MiddlewareVariables } from "../..";
import { validator } from "hono/validator";
import { JoiningTokenSchema } from "./joining.schema";
import { generateJoiningToken, joinLaboratoryByLink } from "./joining.service";

export const joiningRoute = new Hono<{ Variables: MiddlewareVariables }>()

joiningRoute.get("/generate-token",
    validator('json', (value, c) => {
        const parsed = JoiningTokenSchema.safeParse(value)
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
            if (e.includes("not found")) return c.json({ error: e }, 404)
            else if (e.includes("permission")) return c.json({ error: e }, 403)
            else console.error(e)

            return c.json({ error: "Internal server error" }, 500)
        }
    }
)

joiningRoute.post("/:token", async (c) => {
    const token = c.req.param("token")
    const joinerId = c.get("user").id

    try {
        const res = joinLaboratoryByLink(token, joinerId)
    } catch (e: any) {
        if (e === "Invalid token") return c.json({ error: e }, 400)
        else console.error(e)

        return c.json({ error: "Internal server error" }, 500)
    }
})