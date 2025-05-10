document.addEventListener("DOMContentLoaded", async () => {
    const labId = document.querySelector(".content").getAttribute("labId")
    const membersList = document.getElementById("members-list")
    const pageSpan = document.getElementById("page-number")
    const prevBtn = document.getElementById("prev-tool")
    const nextBtn = document.getElementById("next-tool")
    const filterForm = document.getElementById("filter-form")
    const roleSelect = document.getElementById("role-select")
    const loadingModal = document.getElementById("loading")


    let page = 1
    const take = 10

    const loadRoles = async () => {
        const res = await fetch("/api/users/roles")
        if (!res.ok) return
        const roles = await res.json()
        roles.forEach(role => {
            const option = document.createElement("option")
            option.value = role.id
            option.textContent = role.name
            roleSelect.appendChild(option)
        })
    }

    const loadParticipants = async () => {
        const body = {}
        new FormData(filterForm).forEach((value, key) => {
            if (value) body[key] = value
        })

        loadingModal.style.display = "flex"

        const res = await fetch(`/api/laboratories/${labId}/participants?page=${page}&take=${take}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!res.ok) {
            membersList.innerHTML = `<tr><td colspan="4">Ошибка загрузки</td></tr>`
            loadingModal.style.display = "none"
            return
        }

        const participants = await res.json()

        membersList.innerHTML = ""
        if (!participants.length) {
            membersList.innerHTML = `<tr><td colspan="4">Ничего не найдено</td></tr>`
            loadingModal.style.display = "none"
            return
        }

        participants.forEach(({ user, role }) => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td><a href="/app/users/${user.id}">${user.nickname}</a></td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${role.name}</td>
            `
            membersList.appendChild(row)
        })

        pageSpan.textContent = page
        loadingModal.style.display = "none"
    }

    prevBtn.addEventListener("click", () => {
        if (page > 1) {
            page--
            pageSpan.textContent = page
            loadParticipants()
        }
    })

    nextBtn.addEventListener("click", () => {
        page++
        pageSpan.textContent = page
        loadParticipants()
    })

    document.getElementById("filter-button").addEventListener("click", e => {
        page = 1
        pageSpan.textContent = page
        loadParticipants()
    })

    await loadRoles()
    await loadParticipants()

    loadingModal.style.display = "none"
})
