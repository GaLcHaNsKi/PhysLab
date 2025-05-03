import { PrismaClient } from "@prisma/client";
import { ParticipantsFilterSchemaType } from './participant.schema';
import { checkPermission } from "../laboratories.service";

const prisma = new PrismaClient()

export async function getParticipants(laboratoryId: number, page: number, take: number) {
    const participants = await prisma.userLaboratories.findMany({
        take: take,
        skip: (page-1)*take,
        where: {
            laboratoryId
        },
        select: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    name: true,
                    surname: true,
                    email: true
                }
            },
            role: {
                select: { name: true }
            }
        }
    })

    console.log(participants)

    return participants
}

export async function getParticipantsByFilter(laboratoryId: number, filter: ParticipantsFilterSchemaType, page: number, take: number) {
    const participants = await prisma.userLaboratories.findMany({
        take: take,
        skip: (page-1)*take,
        where: {
            laboratoryId,
            role: {
                id: filter.roleId
            },
            user: {
                nickname: { contains: filter.nickname },
                name: filter.name? { contains: filter.name } : filter.name,
                surname: filter.surname? { contains: filter.surname } : filter.surname,
                email: { contains: filter.email }
            }
        },
        select: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    name: true,
                    surname: true,
                    email: true
                }
            },
            role: {
                select: { name: true }
            }
        }
    })

    return participants
}

export async function getParticipantByUserId(laboratoryId: number, userId: number) {
    return await prisma.userLaboratories.findFirst({
        where: {
            laboratoryId,
            userId
        },
        select: {
            user: {
                select: {
                    nickname: true,
                    name: true,
                    surname: true,
                    email: true
                }
            },
            role: {
                select: { name: true }
            }
        }
    })
}

export async function setRoleToParticipantById(labId: number, userId: number, roleId: number, viewerId: number) {
    const role = await prisma.role.findUnique({
        where: { id: roleId }
    })
    if (!role) throw "This role not found"

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) throw "This user not found"

    const laboratory = await prisma.laboratory.findUnique({
        where: { id: labId }
    })
    if (!laboratory) throw "This laboratory not found"

    if (role.name === "root") throw "You don't have permission to do it! Only one user can have role 'root'"

    if (role?.name === "admin") {
        if (!await checkPermission(labId, "grant_admin", viewerId)) throw "You don't have permission to grant admin role"
    }
    else if (role?.name === "researcher") {
        if (!await checkPermission(labId, "grant_researcher", viewerId)) throw "You don't have permission to grant researcher role"
    }

    /// continue
    const tmp = await prisma.userLaboratories.updateMany({
        where: {
            userId, laboratoryId: labId
        },
        data: {
            roleId
        }
    })
    return tmp
}

export async function deleteParticipantById(labId: number, userId: number, viewerId: number) {
    const viewer = await prisma.userLaboratories.findFirst({
        where: {
            laboratoryId: labId,
            userId: viewerId
        },
        select: {
            role: {
                select: { name: true }
            }
        }
    })
    
    if (viewerId !== userId) {
        const user = await prisma.userLaboratories.findFirst({
            where: {
                laboratoryId: labId,
                userId
            },
            select: {
                role: {
                    select: { name: true }
                }
            }
        })
        if (!user) throw "This user not found"

        if (user.role.name === "root") throw "You don't have permission to do it! You cannot delete root"
        else if (user.role.name === "admin") {
            if (!await checkPermission(labId, "grant_admin", viewerId)) throw "You don't have permission to delete admins"
        }
        else if (!await checkPermission(labId, "revoke_access", viewerId)) throw "You don't have permission to delete members"
    }
    else if (viewer?.role.name == "root") throw "You cannot leave your laboratory!"
    /// continue
    const tmp = await prisma.userLaboratories.deleteMany({
        where: {
            userId, laboratoryId: labId
        }
    })

    return tmp
}