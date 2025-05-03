import { Hono } from 'hono'
import { MiddlewareVariables } from '../..'
import { validator } from 'hono/validator';
import { UserEditSchema } from './user.shemas';
import { updateUser, deleteUser, getUserById } from './user.service';
import { deleteCookie } from 'hono/cookie';
import { errorAnswer, successAnswer, undefinedAnswer } from '../../answers';

export const usersRoute = new Hono<{ Variables: MiddlewareVariables }>()

usersRoute.get('/me', async (c) => {
    try {
        const user = c.get('user')

        return c.json(user)
    } catch (e: any) {
        console.error(e)
        
        return c.json({ error: 'Strange error' }, 500)
    }
})

usersRoute.get('/:id', async (c) => {
    try {
        const userId = +c.req.param("id")
        if (isNaN(userId)) {
            return c.json(undefinedAnswer, 404)
        }

        const user = await getUserById(userId)

        return c.json(user)
    } catch (e: any) {
        console.error(e)
        
        return c.json(errorAnswer, 500)
    }
})

usersRoute.put("/me",
    validator('json', (value, c) => {
            const parsed = UserEditSchema.safeParse(value)
            if (!parsed.success) return c.text(parsed.error.message, 400)
    
            return parsed.data
        }),
    async (c) => {
        const data = c.req.valid("json")
        const id = c.get("user").id

        try {
            const user = await updateUser(id, data)

            if (!user) return c.json({ error: "Unauthorized" }, 401)

            return c.json(successAnswer, 200)
        } catch(e: any) {
            if (e.code === "P2002") return c.json({ error: "This nickname or email is busy!" }, 409)
            else console.error(e)
            
            return c.json(errorAnswer, 500)
        }
    }
)

usersRoute.delete("/me", async (c) => {
    const id = c.get("user").id

    try {
        const user = await deleteUser(id)

        if (!user) return c.json({ error: "Unauthorized" }, 401)
        
        deleteCookie(c, "Access-Token")
        deleteCookie(c, "Refresh-Token")

        return c.json(successAnswer, 200)
    } catch (e: any) {
        console.error(e)

        return c.json(errorAnswer, 500)
    }
})