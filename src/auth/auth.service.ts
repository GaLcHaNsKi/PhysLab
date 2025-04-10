import { PrismaClient } from "@prisma/client"
import { SignInSchemaType, SignUpSchemaType } from "./auth.shema"
import { password } from "bun"

const prisma = new PrismaClient()

export async function addUser(body: SignUpSchemaType) {
    const passwordHash = await password.hash(body.password)

    return await prisma.user.create({
        data: {
            nickname: body.nickname,
            email: body.email,
            name: body.name,
            surname: body.surname,
            aboutMe: body.aboutMe,
            passwordHash
        },
        select: {
            id: true
        }
    })
}

export async function loginUser(body: SignInSchemaType) {
    const user = await prisma.user.findUnique({
        where: {
            nickname: body.nickname
        },
        select: {
            id: true,
            passwordHash: true
        }
    })
    
    if (!user) throw "User not found"

    const res = await password.verify(body.password, user.passwordHash)
    if (!res) throw "Incorrect password"

    await prisma.user.update({
        data: {
            lastLoginAt: (new Date()).toISOString()
        },
        where: {
            nickname: body.nickname
        }
    })

    return user
}