async function deletePost(postId, labId) {
    if (!confirm("Вы действительно хотите удалить этот пост?")) {
        return
    }

    document.getElementById("loading").style.display = "flex"

    try {
        const res = await fetch(`/api/laboratories/${labId}/posts/${postId}`, {
            method: "DELETE"
        })
        const data = await res.json()

        if (!res.ok) {
            document.getElementById("loading").style.display = "none"
            alert(data.error || "Ошибка при удалении поста")
            return
        }

        location.reload()
    } catch (err) {
        console.error(err)
        document.getElementById("loading").style.display = "none"
        alert("Ошибка при удалении поста")
    }

    document.getElementById("loading").style.display = "none"
}

async function checkPermission(labId, user, perm) {
    document.getElementById("loading").style.display = "flex"

    const res = await fetch(`/api/laboratories/${labId}/check-perm?user=${user}&perm=${perm}`)
    const data = await res.json()

    document.getElementById("loading").style.display = "none"

    if (!res.ok) return false
    return data.result === "true"
}

document.addEventListener("DOMContentLoaded", async () => {
    const section = document.getElementById("load-posts")
    const labId = section.getAttribute("labId")
    const isSelf = section.getAttribute("isSelf") === "true"
    const author = section.getAttribute("author")
    const isLabWork = section.getAttribute("isLabWork") === "true"

    const pageNumberSpan = document.getElementById("page-number")
    const postsList = document.getElementById("posts-list")
    const submitButton = document.getElementById("submit")

    const loadingModal = document.getElementById("loading")
    loadingModal.style.display = "none"

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
            const courseStr = section.querySelector('select[name="course"]').value.trim()
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
        loadingModal.style.display = "flex"

        const filters = getFilters()
        if (author) filters.authorNickname = author

        const url = `/api/laboratories/${isSelf ? 1000000 : labId}/posts/get-all?page=${currentPage}&isSelf=${isSelf}`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters)
            })

            const data = await res.json()

            postsList.innerHTML = ""

            if (!res.ok) {
                if (res.status === 403) {
                    window.location.href = '/app/forbidden'
                }
                postsList.innerHTML = `<span class="error-message">${data.error}</span>`
                loadingModal.style.display = "none"
                return
            }
            if (!Array.isArray(data) || data.length === 0) {
                postsList.innerHTML = "<span class='error-message'>Ничего нет...</span>"
                loadingModal.style.display = "none"
                return
            }

            data.forEach(post => {
                const div = document.createElement("div")
                div.className = "list-item"

                const firstRow = document.createElement("div")
                firstRow.className = "form-row"

                const h2 = document.createElement("h2")
                const link = document.createElement("a")
                link.href = `/app/laboratories/${post.laboratoryId}/posts/${post.id}?isLabWork=${!(!post.laboratoryWorkId)}`
                link.textContent = post.title
                h2.appendChild(link)

                const spanCratedDate = document.createElement("span")
                spanCratedDate.className = "create-date"
                spanCratedDate.textContent = new Date(post.createdAt).toLocaleString("ru-RU")

                firstRow.appendChild(h2)
                firstRow.appendChild(spanCratedDate)

                const infoRow = document.createElement("div")
                infoRow.className = "form-row"

                // const descriptionSpan = document.createElement("p")
                // descriptionSpan.id = "description"
                // descriptionSpan.textContent = truncate(post.description || "Нет описания", 300)

                const authorSpan = document.createElement("span")
                authorSpan.id = "author"
                if (post.author?.id) {
                    const authorLink = document.createElement("a")
                    authorLink.href = `/app/users/${post.author.id}`
                    authorLink.textContent = post.author.nickname || "неизвестен"
                    authorSpan.innerHTML = "Автор: "
                    authorSpan.appendChild(authorLink)
                } else {
                    authorSpan.textContent = "Автор: неизвестен"
                }

                div.appendChild(firstRow)
                //div.appendChild(descriptionSpan)

                // Добавляем теги
                if (Array.isArray(post.tags) && post.tags.length > 0) {
                    const tagsDiv = document.createElement("div")
                    tagsDiv.className = "tags"
                    post.tags.forEach(tag => {
                        const tagSpan = document.createElement("span")
                        tagSpan.className = "tag"
                        tagSpan.textContent = tag
                        tagsDiv.appendChild(tagSpan)
                    })
                    infoRow.appendChild(tagsDiv)
                }

                infoRow.appendChild(authorSpan)
                div.appendChild(infoRow)

                if (isSelf) {
                    const divWithTools = document.createElement("div")
                    divWithTools.className = "form-row"

                    const tools = document.createElement("div")
                    tools.className = "elem-list"

                    if (isSelf && !author) {
                        const editTool = document.createElement("div")
                        editTool.className = "tool-button"
                        const editToolImg = document.createElement("img")
                        editToolImg.src = "/public/icons/pencil.svg"
                        editToolImg.onclick = (e) => {
                            window.location.href = `/app/laboratories/${post.laboratoryId}/posts/${post.id}/edit?isLabWork=${!(!post.laboratoryWorkId)}`
                        }

                        editTool.appendChild(editToolImg)
                        tools.appendChild(editTool)

                        const delTool = document.createElement("div")
                        delTool.className = "tool-button"
                        const delToolImg = document.createElement("img")
                        delToolImg.src = "/public/icons/trash.svg"
                        delToolImg.onclick = (e) => deletePost(post.id, post.laboratoryId)

                        delTool.appendChild(delToolImg)
                        tools.appendChild(delTool)
                    }

                    divWithTools.appendChild(div)
                    divWithTools.appendChild(tools)

                    postsList.appendChild(divWithTools)
                } else
                    postsList.appendChild(div)
            })

            pageNumberSpan.textContent = currentPage
        } catch (e) {
            postsList.innerHTML = `<span class="error-message">Ошибка загрузки: ${e.message}</span>`
        }

        loadingModal.style.display = "none"
    }

    submitButton.onclick = () => {
        currentPage = 1
        fetchPosts()
    }

    document.getElementById("prev-tool").onclick = () => {
        if (currentPage > 1) {
            currentPage--
            pageNumberSpan.textContent = currentPage
            fetchPosts()
        }
    }

    document.getElementById("next-tool").onclick = () => {
        currentPage++
        pageNumberSpan.textContent = currentPage
        fetchPosts()
    }

    fetchPosts()
})
