document.addEventListener('DOMContentLoaded', async () => {
    const labId = location.pathname.split("/").at(-1)

    const labName = document.getElementById("lab-name")
    const labDescription = document.getElementById("description")

    const loadingModal = document.getElementById("loading")

    try {
        const res = await fetch(`/api/laboratories/${labId}`)
        const lab = await res.json()

        loadingModal.style.display = "none"

        if (!res.ok) {
            if (res.status === 404) window.location.href = "/app/not-found"
            if (res.status === 403) window.location.href = "/app/forbidden"
            else alert(`Какая-то ошибка: ${lab.error}`)
            
            return
        }

        labName.textContent = lab.name
        labDescription.textContent = lab.description
    } catch (e) {
        console.error(e)

        alert(`Какая-то ошибка: ${e}`)
        loadingModal.style.display = "none"
        return
    }

    document.getElementById("go-to-posts")?.addEventListener("click", () => {
        location.href = `/app/laboratories/${labId}/posts`
    })

    document.getElementById("go-to-laboratories")?.addEventListener("click", () => {
        location.href = `/app/laboratories/${labId}/posts?isLabWork=true`
    })

    document.getElementById("view-members")?.addEventListener("click", () => {
        location.href = `/app/laboratories/${labId}/members`
    })

    document.getElementById("edit-lab")?.addEventListener("click", () => {
        location.href = `/app/laboratories/${labId}/edit`
    })

    document.getElementById("inviting-link-as-guest")?.addEventListener("click", () => {
        navigator.clipboard.writeText(location.href)
        alert("Скопировано!")
    })

    document.getElementById("join-as-guest")?.addEventListener("click", async () => {
        loadingModal.style.display = "flex"

        try {
            const resp = await fetch(`/api/laboratories/${labId}/joining/as-guest`, {
                method: "POST"
            })
            const res = await resp.json()

            loadingModal.style.display = "none"

            if (!res.ok) {
                alert(`Какая-то ошибка: ${lab.error}`)
                return
            }

            alert("Добро пожаловать!")
        } catch (e) {
            console.error(e)

            alert(`Какая-то ошибка: ${e}`)
            loadingModal.style.display = "none"
            return
        }
    })

    async function fetchRoleIdByName(name) {
        const rolesRes = await fetch("/api/users/roles")
        const roles = await rolesRes.json()
        const role = roles.find(r => r.name === name)
        return role?.id
    }

    async function generateAndCopyInviteLink(roleName) {
        loadingModal.style.display = "flex"

        const roleId = await fetchRoleIdByName(roleName)
        if (!roleId) {
            loadingModal.style.display = "none"
            return alert("Ошибка: роль не найдена")
        }

        const res = await fetch(`/api/laboratories/${labId}/joining/generate-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleId })
        })
        const data = await res.json()

        if (!roleId) {
            loadingModal.style.display = "none"
            return alert("Ошибка при создании ссылки")
        }

        loadingModal.style.display = "none"

        const link = `${location.origin}/api/laboratories/${labId}/joining/${data}`
        navigator.clipboard.writeText(link)
        alert("Скопировано!")
    }

    document.getElementById("inviting-link-as-admin")?.addEventListener("click", () => generateAndCopyInviteLink("admin"))
    document.getElementById("inviting-link-as-researcher")?.addEventListener("click", () => generateAndCopyInviteLink("researcher"))
    document.getElementById("inviting-link-as-student")?.addEventListener("click", () => generateAndCopyInviteLink("student"))
})
