import { PrismaClient } from '@prisma/client';
import { env } from 'bun';
import { Dropbox } from 'dropbox'
import { v4 } from 'uuid';

const accessToken = env.DROPBOX_ACCESS_TOKEN!

const dbx = new Dropbox({ accessToken, fetch })
const prisma = new PrismaClient()

export async function getAllDocuments(postId: number) {
    const documents = await prisma.file.findMany({
        where: {
            postId: postId
        }
    })

    let files: any[] = []
    for (let doc of documents) {
        const link = await dbx.filesGetTemporaryLink({ path: '/documents/' + doc.uuidName })
        
        files.push({ document: doc, link: link.result.link })
    }
    
    return files
}

export async function createFileAndUpload(postId: number, userId: number, file: File) {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    if (!post) throw "Post not found"

    console.log()
    if (file.size == 0) throw "File cannot be empty!"
    
    const uuidName = v4() + "." + file.name.split('.').pop()

    const res = await dbx.filesUpload({path: '/documents/' + uuidName, contents: file})

    if (res.status !== 200) {
        return res
    }

    await prisma.file.create({
        data: {
            name: file.name,
            postId,
            uuidName,
            uploadedById: userId,
            isImage: file.type.startsWith("image/"),
        }
    })

    return res
}

export async function getFileById(fileId: number) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })

    if (!file) return null

    const link = await dbx.filesGetTemporaryLink({ path: '/documents/' + file.uuidName })

    return {file, link: link.result.link}
}

export async function deleteFileById(fileId: number) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })

    if (!file) return null

    await dbx.filesDeleteV2({ path: '/documents/' + file.uuidName })

    await prisma.file.delete({
        where: {
            id: fileId
        }
    })

    return file
}