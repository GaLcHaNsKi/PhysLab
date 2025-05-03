document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("load-posts")
    const labId = section.getAttribute("labId")
    const isSelf = section.getAttribute("isSelf") === "true"
    const isLabWork = section.getAttribute("isLabWork") === "true"

    const pageNumberSpan = document.getElementById("page-number")
    const postsList = document.getElementById("posts-list")
    const submitButton = document.getElementById("submit")

    let currentPage = 1

    const getFilters = () => {
        const filters = {}

        const title = section.querySelector('input[name="title"]').value.trim()
        if (title) filters.title = title

        if (!isSelf) {
            const authorNickname = section.querySelector('input[name="authorNickname"]').value.trim()
            if (authorNickname) filters.authorNickname = authorNickname
        }

        const tagsRaw = section.querySelector('input[name="tags"]').value.trim()
        if (tagsRaw) {
            filters.tags = tagsRaw
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
        }

        if (isLabWork) {
            const courseStr = section.querySelector('input[name="course"]').value.trim()
            const semester = section.querySelector('select[name="semester"]').value

            const course = parseInt(courseStr)
            if (!isNaN(course) && course >= 1 && course <= 4) {
                filters.course = course
            }

            if (semester === "AUTUMN" || semester === "SPRING") {
                filters.semester = semester
            }
        }

        return filters
    }

    const fetchPosts = async () => {
        const filters = getFilters()
        const url = `/api/laboratories/1/posts/get-all?page=${currentPage}`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters)
            })

            const data = await res.json()

            postsList.innerHTML = ""

            if (!res.ok) {
                postsList.innerHTML = `<span>${data.error}</span>`
                return
            }
            if (!Array.isArray(data) || data.length === 0) {
                postsList.innerHTML = "<span>Ничего нет...</span>"
                return
            }

            data.forEach(post => {
                const a = document.createElement("a")
                a.href = `/app/laboratories/${post.laoratoryId}/posts/${post.id}`
                a.textContent = post.title
                postsList.appendChild(a)
            })

            pageNumberSpan.textContent = currentPage
        } catch (e) {
            postsList.innerHTML = `<span>Ошибка загрузки: ${e.message}</span>`
        }
    }

    submitButton.onclick = () => {
        currentPage = 1
        fetchPosts()
    }

    document.getElementById("prev-tool").onclick = () => {
        if (currentPage > 1) {
            currentPage--
            fetchPosts()
        }
    }

    document.getElementById("next-tool").onclick = () => {
        currentPage++
        fetchPosts()
    }

    fetchPosts()
})
