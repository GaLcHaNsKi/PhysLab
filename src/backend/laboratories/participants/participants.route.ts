import { Hono } from "hono";
import { validator } from "hono/validator";
import { ParticipantsFilterSchema, ParticipantsGetOneSchema, ParticipantsSetRoleSchema } from "./participant.schema";
import { checkPermission } from "../laboratories.service";
import { MiddlewareVariables } from "../../..";
import { deleteParticipantById, getParticipantByUserId, getParticipantsByFilter, setRoleToParticipantById } from "./participants.service";
import { errorAnswer, successAnswer, undefinedAnswer } from "../../../answers";
import { LaboratoryPaginationSchema } from "../laboratories.shema";

export const participantsRoute = new Hono<{ Variables: MiddlewareVariables }>()

participantsRoute.get("/me", async (c) => {
    const user = c.get("user")
    const labId = c.req.param("labId")

    if (!labId || isNaN(+labId)) return c.json(undefinedAnswer, 404)
    
    try {
        const participant = await getParticipantByUserId(+labId, user.id)
        if (!participant) return c.json(undefinedAnswer, 404)
        
        return c.json(participant, 200)
    } catch (e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})

participantsRoute.delete("/me", async (c) => {
    const user = c.get("user")
    const labId = c.req.param("labId")

    if (!labId || isNaN(+labId)) return c.json(undefinedAnswer, 404)
    
    try {
        const tmp = await deleteParticipantById(+labId, user.id, user.id)
        if (!tmp) return c.json(undefinedAnswer, 404)
        
        return c.json(successAnswer, 200)
    } catch (e: any) {
        if (e.includes && e.includes("cannot")) return c.json({ error: e}, 403)
        else console.error(e)

        return c.json(errorAnswer, 500)
    }
})

participantsRoute.post("/",
    validator('query', (value, c) => {
        const laboratoryId = c.req.param("labId")
        const parsed = LaboratoryPaginationSchema.safeParse({ ...value, laboratoryId: laboratoryId ? +laboratoryId : undefined })
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    validator('json', (value, c) => {
        const parsed = ParticipantsFilterSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const userId = c.get("user").id
        const { laboratoryId, page, take } = c.req.valid("query")
        const filter = c.req.valid("json")

        try {
            if (!await checkPermission(laboratoryId, "view_laboratory_members", userId)) return c.json({ error: "You don't have permission to view list of laboratory's participants" }, 403)

            const participants = await getParticipantsByFilter(laboratoryId, filter, page, take)

            return c.json(participants)
        } catch (e: any) {
            console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

participantsRoute.get("/:userId",
    validator('param', (value, c) => {
        const parsed = ParticipantsGetOneSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const viewerId = c.get("user").id
        const { labId, userId } = c.req.valid("param") // userId - id of participant

        try {
            if (!await checkPermission(labId, "view_laboratory_members", viewerId)) return c.json({ error: "You don't have permission to view laboratory's participants" }, 403)

            const participant = await getParticipantByUserId(labId, userId)
            if (!participant) return c.json(undefinedAnswer, 404)

            return c.json(participant)
        } catch (e: any) {
            console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

participantsRoute.delete("/:userId",
    validator('param', (value, c) => {
        const parsed = ParticipantsGetOneSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const viewerId = c.get("user").id
        const { labId, userId } = c.req.valid("param") // userId - id of participant

        try {
            const participant = await deleteParticipantById(labId, userId, viewerId)
            if (!participant) return c.json(undefinedAnswer, 404)

            return c.json(successAnswer, 200)
        } catch (e: any) {
            if (e.includes && e.includes("permission")) return c.json({ error: e}, 403)
            if (e.includes && e.includes("not found")) return c.json({ error: `${undefinedAnswer.error} ${e}` }, 404)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)

participantsRoute.put("/:userId/set-role/:roleId",
    validator('param', (value, c) => {
        const parsed = ParticipantsSetRoleSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const viewerId = c.get("user").id
        const { labId, userId, roleId } = c.req.valid("param") // userId - id of participant

        try {
            const participant = await setRoleToParticipantById(labId, userId, roleId, viewerId)
            if (!participant) return c.json(undefinedAnswer, 404)

            return c.json(successAnswer, 200) 
        } catch (e: any) {
            if (e.includes && e.includes("permission")) return c.json({ error: e}, 403)
            if (e.includes && e.includes("not found")) return c.json({ error: `${undefinedAnswer.error} ${e}` }, 404)
            else console.error(e)

            return c.json(errorAnswer, 500)
        }
    }
)