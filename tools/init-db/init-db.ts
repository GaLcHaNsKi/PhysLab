import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function init() {
    // adding permissions
    await prisma.permission.createMany({
        data: [
            { name: "grant_admin" },
            { name: "grant_researcher" },
            { name: "revoke_access" },
            { name: "view_laboratory_members" },
            { name: "delete_laboratory_members" },
            { name: "view_users_list" },
            { name: "delete_users" },
            { name: "delete_laboratory" },
            { name: "edit_laboratory_settings" },
            { name: "view_logs" },
            { name: "add_laboratory_worker" },
            { name: "add_equipment" },
            { name: "create_post" },
            { name: "create_moderated_post" },
            { name: "edit_unowned_posts" },
            { name: "delete_unowned_posts" },
            { name: "create_comment" },
            { name: "create_moderated_comment" },
            { name: "edit_unowned_comment" },
            { name: "delete_unowned_comment" },
            { name: "uploading_documents" },
            { name: "delete_unowned_documents" },
            { name: "create_joining_admin_link" }, //23
            { name: "create_joining_other_link" } // 24
        ]
    })
    // adding roles
    await prisma.role.createMany({
        data: [
            { name: "root" },
            { name: "admin" },
            { name: "researcher" },
            { name: "student" },
            { name: "guest" },
        ]
    })
    
    await prisma.rolePermission.createMany({
        data: [
            // root
            { roleId: 1, permissionId: 1 },
            { roleId: 1, permissionId: 2 },
            { roleId: 1, permissionId: 3 },
            { roleId: 1, permissionId: 4 },
            { roleId: 1, permissionId: 5 },
            { roleId: 1, permissionId: 6 },
            { roleId: 1, permissionId: 7 },
            { roleId: 1, permissionId: 8 },
            { roleId: 1, permissionId: 9 },
            { roleId: 1, permissionId: 10 },
            { roleId: 1, permissionId: 11 },
            { roleId: 1, permissionId: 12 },
            { roleId: 1, permissionId: 13 },
            { roleId: 1, permissionId: 14 },
            { roleId: 1, permissionId: 15 },
            { roleId: 1, permissionId: 16 },
            { roleId: 1, permissionId: 17 },
            { roleId: 1, permissionId: 18 },
            { roleId: 1, permissionId: 19 },
            { roleId: 1, permissionId: 20 },
            { roleId: 1, permissionId: 21 },
            { roleId: 1, permissionId: 22 },
            { roleId: 1, permissionId: 23 },
            { roleId: 1, permissionId: 24 },
            // admin
            { roleId: 2, permissionId: 2 },
            { roleId: 2, permissionId: 3 },
            { roleId: 2, permissionId: 4 },
            { roleId: 2, permissionId: 5 },
            { roleId: 2, permissionId: 9 },
            { roleId: 2, permissionId: 10 },
            { roleId: 2, permissionId: 11 },
            { roleId: 2, permissionId: 17 },
            { roleId: 2, permissionId: 19 },
            { roleId: 2, permissionId: 20 },
            { roleId: 1, permissionId: 24 },
            // researcher
            { roleId: 3, permissionId: 4 },
            { roleId: 3, permissionId: 12 },
            { roleId: 3, permissionId: 13 },
            { roleId: 3, permissionId: 15 },
            { roleId: 3, permissionId: 16 },
            { roleId: 3, permissionId: 17 },
            { roleId: 3, permissionId: 21 },
            { roleId: 3, permissionId: 22 },
            // student
            { roleId: 4, permissionId: 14 },
            { roleId: 4, permissionId: 18 },
            { roleId: 4, permissionId: 21 },
        ]
    })
}

init()