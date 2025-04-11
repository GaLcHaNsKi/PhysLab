import { PrismaClient } from "@prisma/client";
import { LaboratoryCreateSchemaType, LaboratoryEditSchemaType } from "./laboratories.shema";

const prisma = new PrismaClient()

export async function createLaboratory(data: LaboratoryCreateSchemaType, ownerId: number) {
    const laboratory = await prisma.laboratory.create({
        data: {
            name: data.name,
            description: data.description,
            visibility: data.visibility,
            ownerId: ownerId
        },
        select: {
            id: true
        }
    })

    const role = await prisma.role.findUnique({
        where: {
            name: "root"
        },
        select: {
            id: true
        }
    })

    await prisma.userLaboratories.create({
        data: {
            userId: ownerId,
            laboratoryId: laboratory.id,
            roleId: role!.id
        }
    })

    return laboratory
}

export async function editLaboratory(data: LaboratoryEditSchemaType, editorId: number) {
    const laboratory = await prisma.laboratory.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            description: data.description,
            visibility: data.visibility
        },
        select: {
            id: true
        }
    })

    return laboratory
}

export async function getAllPublicLaboratoriesList(page: number = 1, limit: number = 10) {
    const laboratories = await prisma.laboratory.findMany({
        where: {
            visibility: "PUBLIC"
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
            id: true,
            name: true,
            description: true
        }
    })

    return laboratories
}

export async function deleteLaboratory(laboratoryId: number) {
    const laboratory = await prisma.laboratory.delete({
        where: {
            id: laboratoryId
        }
    })

    return laboratory
}

export async function checkPermission(laboratoryId: number, permission: string, userId: number) {
    const res = await prisma.rolePermission.findFirst({
        where: {
            role: {
                UsersLaboratories: {
                    some: {
                        userId,
                        laboratoryId
                    }
                }
            },
            permission: {
                name: permission
            }
        }
    })

    return !!res
}

export async function getLaboratoryById(laboratoryId: number) {
    const laboratory = await prisma.laboratory.findUnique({
        where: {
            id: laboratoryId
        },
        select: {
            name: true,
            description: true,
            visibility: true,
            ownerId: true
        }
    })

    return laboratory
}

export async function checkIsUserInLaboratory(laboratoryId: number, userId: number) {
    const res = await prisma.userLaboratories.findFirst({
        where: {
            laboratoryId,
            userId
        }
    })

    return !!res
}