import { PrismaClient } from "@prisma/client";
import { PostCreateSchemaType, PostEditSchemaType, PostsFilterSchemaType } from "./posts.schema";

const prisma = new PrismaClient()

export async function getAllPosts(labId: number, page: number, take: number, filter: PostsFilterSchemaType, isSelf: boolean) {
    const where: any = {
        title: filter.title ? { contains: filter.title } : undefined,
        author: {
            nickname: filter.authorNickname ? { contains: filter.authorNickname, mode: "insensitive" } : undefined,
        },
        tags: filter.tags && filter.tags.length > 0 ? { hasSome: filter.tags } : undefined,
        isDeleted: false
    }
    if (!isSelf) where.laboratoryId = labId
    
    if (filter.semester) {
        where.laboratoryWork = {
            course: filter.course,
            semester: filter.semester
        }
    } else {
        where.laboratoryWorkId = null // обычные посты
    }

    const posts = await prisma.post.findMany({
        take,
        skip: (page - 1) * take,
        where,
        select: {
            id: true,
            title: true,
            laboratoryId: true,
            author: {
                select: {
                    id: true,
                    nickname: true
                }
            }
        }
    })

    return posts
}

export async function getPostById(postId: number, labId: number, isLabWork: boolean) {
    const where: any = {
        id: postId,
        laboratoryId: labId,
        isDeleted: false
    }

    if (isLabWork) {
        where.laboratoryWorkId = { not: null } // если это лабораторная работа
    } else {
        where.laboratoryWorkId = null // если обычный пост
    }

    const post = await prisma.post.findFirst({
        where,
        select: {
            id: true,
            title: true,
            text: true,
            author: {
                select: {
                    id: true,
                    nickname: true,
                    surname: true,
                    name: true
                }
            },
            createdAt: true,
            editedAt: true,
            tags: true
        }
    })

    return post
}

export async function getLaboratoryWorkId(course: number, semester: "AUTUMN" | "SPRING") {
    const labWork = await prisma.laboratoryWork.findFirst({
        where: {
            course,
            semester
        },
        select: {
            id: true
        }
    })
    
    if (!labWork) throw "Laboratory work not found"
    return labWork.id!
}

export async function createPost(authorId: number, data: PostCreateSchemaType, isLabWork: boolean) {
    const postData: any = {
        title: data.title,
        text: data.text,
        authorId,
        tags: data.tags? data.tags : [],
        laboratoryId: data.labId,
    };

    if (isLabWork) {
        postData.laboratoryWorkId = await getLaboratoryWorkId(data.course!, data.semester!)
    }

    const post = await prisma.post.create({
        data: postData
    });

    return post;
}


export async function editPost(data: PostEditSchemaType, userId: number, isEditUnownedPost: boolean, isLabWork: boolean) {
    const post = await prisma.post.findFirst({
        where: {
            id: data.postId,
            laboratoryId: data.labId,
            isDeleted: false
        },
        select: {
            authorId: true,
            laboratoryWork: {
                select: {
                    course: true,
                    semester: true
                }
            }
        }
    })
    
    if (!post) throw "Post not found"
    if (post.authorId !== userId && !isEditUnownedPost) throw "You don't have permission to edit this post!"

    const postData: any = {
        title: data.title,
        text: data.text,
        tags: data.tags,
        laboratoryId: data.labId,
        editedAt: new Date(),
        editedById: userId
    };

    if (isLabWork) {
        if (data.course || data.semester) {
            data.course = data.course || post.laboratoryWork!.course
            data.semester = data.semester || post.laboratoryWork!.semester

            postData.laboratoryWorkId = await getLaboratoryWorkId(data.course, data.semester)
        }
    }

    const editedPost = await prisma.post.update({
        where: {
            id: data.postId
        },
        data: postData
    })

    return editedPost
}

export async function deletePost(postId: number, labId: number, userId: number) {
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            laboratoryId: labId,
            isDeleted: false
        },
        select: {
            authorId: true
        }
    })
    
    if (!post) throw "Post not found"
    if (post.authorId !== userId) throw "You don't have permission to delete this post!"

    const deletedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            isDeleted: true,
            deletedById: userId
        }
    })

    return deletedPost
}