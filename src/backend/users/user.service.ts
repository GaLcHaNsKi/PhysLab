import { PrismaClient } from "@prisma/client"
import { UserEditShemaType } from "./user.shemas"

const prisma = new PrismaClient()

export async function getUsers() {
    return await prisma.user.findMany()
}

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            nickname: true,
            name: true,
            surname: true,
            email: true,
            aboutMe: true
        }
    })
}

export async function updateUser(id: number, data: UserEditShemaType) {
    const user = await prisma.user.update({
        data: {
            ...data
        },
        where: { id }
    })

    return user
}

export async function deleteUser(id: number) {
    const user = await prisma.user.delete({
        where: { id }
    })

    return user
}