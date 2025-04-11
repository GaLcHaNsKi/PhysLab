import { PrismaClient } from "@prisma/client";
import { env } from "bun";
import { sign, verify } from "hono/jwt";
import { checkPermission } from "../laboratories.service";

const prisma = new PrismaClient()

export async function generateJoiningToken(laboratoryId: number, userId: number, roleId: number, workTime: number) {
    // checking laboratory existence
    const laboratory = await prisma.laboratory.findUnique({
        where: {
            id: laboratoryId
        }
    })
    if (!laboratory) throw "Laboratory not found"

    // checking role existence
    const role = await prisma.role.findUnique({
        where: {
            id: roleId
        },
        select: {
            name: true
        }
    })
    if (!role) throw "Role not found"

    if (role.name == "admin") {
        if (!await checkPermission(laboratoryId, "create_joining_admin_link", userId)) throw "You don't have permission to create joining link for admin"
    }

    if (! await checkPermission(laboratoryId, "create_joining_other_link", userId)) throw "You don't have permission to create joining link"

    // generating jwt token

    const token = await sign({
        laboratoryId,
        roleId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * workTime) // 1 hour expiration
    }, env.JWT_SECRET!)

    return token
}

// function for joining to laboratory by token
export async function joinLaboratoryByLink(token: string, joinerId: number) {
    // data includes params for joining at laboratory, joinerId is id of user that follow by link with token
    const data = await verify(token, env.JWT_SECRET!) as { laboratoryId: number, roleId: number }

    if (!data || !data.laboratoryId || !data.roleId) throw "Invalid token"

    // i need to add joiner to target laboratory
    const row = prisma.userLaboratories.create({
        data: {
            ...data,
            userId: joinerId
        }
    })

    return row
}