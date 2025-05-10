document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("load-posts")
    const labList = document.getElementById("lab-list")
    const pageNumberSpan = document.getElementById("page-number")
    const loadingModal = document.getElementById("loading")

    const prevButton = document.getElementById("prev-tool")
    const nextButton = document.getElementById("next-tool")
    const submitButton = document.getElementById("submit")

    loadingModal.style.display = "none"
    
    let currentPage = 1
    const limit = 10

    const truncate = (str, maxLength) =>
        str.length > maxLength ? str.slice(0, maxLength) + "…" : str

    const getFilters = () => {
        const name = section.querySelector('input[name="name"]').value.trim()
        const nickname = section.querySelector('input[name="nickname"]').value.trim()
        const filters = {}

        if (name) filters.name = name
        if (nickname) filters.authorNickname = nickname

        return filters
    }

    const fetchLabs = async () => {
        loadingModal.style.display = "flex"

        const filters = getFilters()
        pageNumberSpan.textContent = currentPage

        try {
            const res = await fetch(`/api/laboratories/get-all?page=${currentPage}&limit=${limit}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters)
            })

            if (!res.ok) {
                loadingModal.style.display = "none"
                throw new Error(`Ошибка сервера: ${res.statusText}`)
            }

            const data = await res.json()

            labList.innerHTML = ""

            if (!Array.isArray(data) || data.length === 0) {
                labList.innerHTML = "<span>Ничего нет...</span>"
                loadingModal.style.display = "none"
                return
            }

            data.forEach(lab => {
                const div = document.createElement("div")
                div.className = "list-item"

                const h2 = document.createElement("h2")
                const link = document.createElement("a")
                link.href = `/app/laboratories/${lab.id}`
                link.textContent = lab.name
                h2.appendChild(link)

                const infoRow = document.createElement("div")
                infoRow.className = "form-row"

                const descriptionSpan = document.createElement("p")
                descriptionSpan.id = "description"
                descriptionSpan.textContent = truncate(lab.description || "Нет описания", 300)

                const authorSpan = document.createElement("span")
                authorSpan.id = "author"
                if (lab.owner?.id) {
                    const authorLink = document.createElement("a")
                    authorLink.href = `/app/users/${lab.owner.id}`
                    authorLink.textContent = lab.owner.nickname || "неизвестен"
                    authorSpan.innerHTML = "Автор: "
                    authorSpan.appendChild(authorLink)
                } else {
                    authorSpan.textContent = "Автор: неизвестен"
                }
                
                infoRow.appendChild(descriptionSpan)
                infoRow.appendChild(authorSpan)

                div.appendChild(h2)
                div.appendChild(infoRow)

                labList.appendChild(div)
            })
        } catch (err) {
            console.error(err)
            labList.innerHTML = `<span>Ошибка загрузки: ${err.message}</span>`
        }

        loadingModal.style.display = "none"
    }

    submitButton.onclick = () => {
        currentPage = 1
        fetchLabs()
    }

    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--
            pageNumberSpan.textContent = currentPage
            fetchLabs()
        }
    }

    nextButton.onclick = () => {
        currentPage++
        pageNumberSpan.textContent = currentPage
        fetchLabs()
    }

    // Загрузка при открытии страницы
    fetchLabs()
})
