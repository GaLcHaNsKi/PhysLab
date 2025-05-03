import { PrismaClient } from "@prisma/client"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { verify } from "hono/jwt"
import { UserInfo } from "../users/user.types"
import { env } from "bun"

const prisma = new PrismaClient()

export const authMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path.includes("/auth/") || c.req.path.endsWith("app") || c.req.path.includes("/public")) {
        return next()
    }

    const token = getCookie(c, "Access-Token")
    if (!token) {
        return c.text("Unauthorized", 401)
    }
    let data
    try {
        data = await verify(token, env.JWT_SECRET!!) as { userId: number }
    } catch (e: any) {
        if (e.message.includes("expired")) return c.json({ error: "Token expired" }, 401)
        else console.error(e)

        return c.text("Invalid token", 401)
    }

    const userId = data.userId
    if (!userId) {
        return c.text("Unauthorized", 401)
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nickname: true,
                email: true,
                name: true,
                surname: true,
                aboutMe: true
            }
        })
        if (!user) {
            return c.text("Unauthorized", 401)
        }

        c.set("user", user as UserInfo)

        return next()
    } catch (e) {
        console.error(e)
        return c.text("Error", 500)
    }
})