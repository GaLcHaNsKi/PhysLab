import { PrismaClient } from '@prisma/client'
import { createCommentSchemaType } from './comments.schema'

const prisma = new PrismaClient()

export async function createComment(data: createCommentSchemaType) {
    const comment = await prisma.comments.create({
        data: {
            text: data.text,
            authorId: data.authorId,
            postId: data.postId,
            answerId: data.answerId,
            isModerated: data.isModerated,
        },
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
            answer: {
                select: {
                    id: true,
                    text: true,
                },
            },
        },
    })

    if (!comment.isModerated) {
        console.log(`Notification: Comment ${comment.id} requires moderation`)
    }

    if (data.answerId) {
        console.log("Sending notification...")
    }

    return comment
}

export async function getCommentById(commentId: number) {
    const comment = await prisma.comments.findUnique({
        where: {
            id: commentId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            answer: {
                select: {
                    id: true,
                    text: true,
                },
            },
        },
    })

    return comment
}

export async function getAllComments(postId: number) {
    const comments = await prisma.comments.findMany({
        where: {
            postId,
            isModerated: true,
        },
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            answer: {
                select: {
                    id: true,
                    text: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    })

    return comments
}