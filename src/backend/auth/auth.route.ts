import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { addUser, loginUser } from './auth.service'
import { SignInSchema, SignUpSchema } from './auth.shema'
import { sign, verify } from "hono/jwt"
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { env } from 'bun'
import { errorAnswer, successAnswer } from '../../answers'

export const authRoute = new Hono()

const ACCESS_TOKEN_LIVE = env.ACCESS_TOKEN_LIVE ? +env.ACCESS_TOKEN_LIVE : 60 * 60 * 24 // 1 day
const REFRESH_TOKEN_LIVE = env.REFRESH_TOKEN_LIVE ? +env.REFRESH_TOKEN_LIVE : 60 * 60 * 24 * 30 // 30 days
const JWT_SECRET = env.JWT_SECRET

authRoute.post("/sign-in",
    validator('json', (value, c) => {
        const parsed = SignInSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const body = c.req.valid('json')

        try {
            const user = await loginUser(body)

            if (!user) return c.text("User with this password is not found! Check your password!", 404)
                
            const accessToken = await sign({userId: user.id, exp: (Date.now()/1000) + ACCESS_TOKEN_LIVE }, JWT_SECRET!!)
            const refreshToken = await sign({ userId: user.id, isRefresh: true, exp: (Date.now()/1000) + REFRESH_TOKEN_LIVE }, JWT_SECRET!!)
            
            setCookie(c, "Access-Token", accessToken, {
                maxAge: ACCESS_TOKEN_LIVE,
                httpOnly: true,
                //secure: true,
                path: "/"
            })
            setCookie(c, "Refresh-Token", refreshToken, {
                maxAge: REFRESH_TOKEN_LIVE,
                httpOnly: true,
                //secure: true,
                path: "/auth/refresh-token"
            })

            return c.json(successAnswer, 200)
        }
        catch (e: any) {
            if (e === "Incorrect password") return c.json({ error: e }, 400)
            else if (e === "User not found") return c.json({ error: e }, 404)
            else console.error(e)
        
            return c.json(errorAnswer, 500)
        }
    }
)

authRoute.post("/sign-up",
    validator('json', (value, c) => {
        console.log(value)
        const parsed = SignUpSchema.safeParse(value)
        if (!parsed.success) return c.text(parsed.error.message, 400)

        return parsed.data
    }),
    async (c) => {
        const body = c.req.valid('json')

        try {
            const user = await addUser(body)

            const accessToken = await sign({userId: user.id, exp: (Date.now()/1000) + ACCESS_TOKEN_LIVE }, JWT_SECRET!!)
            const refreshToken = await sign({ userId: user.id, isRefresh: true, exp: (Date.now()/1000) + REFRESH_TOKEN_LIVE }, JWT_SECRET!!)
            
            setCookie(c, "Access-Token", accessToken, {
                maxAge: ACCESS_TOKEN_LIVE,
                httpOnly: true,
                //secure: true,
                path: "/"
            })
            setCookie(c, "Refresh-Token", refreshToken, {
                maxAge: REFRESH_TOKEN_LIVE,
                httpOnly: true,
                //secure: true,
                path: "/auth/refresh-token"
            })

            return c.json(successAnswer, 200)
        } catch (error: any) {
            if (error.message === "Passwords do not match!") return c.json({ error: error.message }, 400)
            if (error.code === "P2002") return c.json({ error: "This nickname or email is busy!" }, 409)
            else console.error(error)

            return c.json(errorAnswer, 500)
        }
    }
)

authRoute.post("/sign-out", async (c) => {
    deleteCookie(c, "Access-Token")
    deleteCookie(c, "Refresh-Token")

    return c.text("Good bye!", 200)
})

authRoute.post("/refresh-token", async (c) => {
    const token = getCookie(c, "Refresh-Token")
    
    if (!token) return c.json({ error: "Unauthorized" }, 401)

    let data
    try {
        data = await verify(token, JWT_SECRET!!)
    } catch (e) {
        console.error(e)
        return c.json({ error: "Invalid token!" }, 401)
    }
    
    if (!data) return c.json({ error: "Unauthorized" }, 401)
    
    if (!data.isRefresh) return c.json({ error: "Invalid token!" }, 401)
    
    const userId = data.userId
    const accessToken = await sign({ userId, exp: (Date.now()/1000) + ACCESS_TOKEN_LIVE }, JWT_SECRET!!)

    setCookie(c, "Access-Token", accessToken, {
        maxAge: ACCESS_TOKEN_LIVE,
        httpOnly: true,
        //secure: true,
        path: "/"
    })
    
    return c.json(successAnswer, 200)
})
