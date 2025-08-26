document.addEventListener("DOMContentLoaded", async () => {
    const addFileButton = document.getElementById("addFile")
    const filesContainer = document.getElementById("files")
    const saveButton = document.getElementById("save")
    const errorMessage = document.querySelector(".error-message")

    const editor = document.querySelector(".editor")
    const labId = editor?.getAttribute("lab-id")
    const postId = editor?.getAttribute("postId")
    const isLabWork = editor?.getAttribute("isLabWork") === "true"
    const isEdit = !(!postId)

    const loadingModal = document.getElementById("loading")

    let fileCount = 1

    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#post-body',
            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount math',
            toolbar: 'undo redo | blocks | bold italic underline strikethrough backcolor forecolor | link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table image insertdatetime | removeformat | math | fullscreen',
            height: 400,
            menubar: false,
            setup: (editor) => {
                editor.on('init', async () => {
                    // Заполнение при редактировании
                    if (isEdit && labId && postId) {
                        try {
                            const res = await fetch(`/api/laboratories/${labId}/posts/${postId}`)
                            const data = await res.json()
                            if (!res.ok) throw new Error(data.error)

                            document.getElementById("post-title").value = data.title || ""
                            editor.setContent(data.text || "")
                            document.getElementById("tags").value = (data.tags || []).join(", ")

                            if (isLabWork) {
                                const courseSelect = document.querySelector("select[name='course']")
                                const semesterSelect = document.querySelector("select[name='semester']")
                                const simLinkInput = document.getElementById("simLink")

                                if (data.course) courseSelect.value = data.course.toString()
                                if (data.semester) semesterSelect.value = data.semester
                                if (data.simLink) simLinkInput.value = data.simulatorLink
                            }
                        } catch (e) {
                            console.error("Ошибка при загрузке поста:", e)
                            errorMessage.textContent = "Не удалось загрузить данные поста."
                        }
                    }
                })
            }
        })
    } else {
        console.error('TinyMCE не загружен.')
        errorMessage.textContent = 'Ошибка загрузки редактора текста.'
    }

    loadingModal.style.display = "none"

    addFileButton?.addEventListener("click", () => {
        fileCount++
        const input = document.createElement("input")
        input.type = "file"
        input.className = "input-files"
        input.id = `file${fileCount}`
        filesContainer?.appendChild(input)
    })

    saveButton?.addEventListener("click", async () => {
        errorMessage.textContent = ""

        const title = document.getElementById("post-title").value.trim()
        const tags = document.getElementById("tags").value
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length)

        let text = ''
        const tinymceEditor = tinymce.get('post-body')
        if (tinymceEditor) {
            text = tinymceEditor.getContent().trim()
        } else {
            errorMessage.textContent = 'Редактор текста не инициализирован.'

            loadingModal.style.display = "none"
            return
        }

        if (!title) {
            errorMessage.textContent = "Название не может быть пустым"
            loadingModal.style.display = "none"
            return
        }
        if (!text) {
            errorMessage.textContent = "Тело поста не может быть пустым"
            loadingModal.style.display = "none"
            return
        }
        if (tags.length === 0) {
            errorMessage.textContent = "Укажите хотя бы один тег"
            loadingModal.style.display = "none"
            return
        }

        const payload = {
            labId: parseInt(labId || ""),
            title,
            text,
            tags
        }

        if (isLabWork) {
            const course = document.querySelector("select[name='course']")?.value
            const semester = document.querySelector("select[name='semester']")?.value
            const simLink = document.getElementById("simLink")?.value.trim()

            payload.course = parseInt(course)
            payload.semester = semester
            if (simLink) {
                payload.simLink = simLink
            }
        }

        loadingModal.style.display = "flex"

        try {
            const url = isEdit
                ? `/api/laboratories/${labId}/posts/${postId}?isLabWork=${isLabWork}`
                : `/api/laboratories/${labId}/posts/create?isLabWork=${isLabWork}`

            const method = isEdit ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (!res.ok) {
                if (res.status === 403) {
                    window.location.href = "/app/forbidden"
                }
                errorMessage.textContent = result.error || "Ошибка при сохранении поста"
                loadingModal.style.display = "none"
                return
            }

            const newPostId = postId || result.id
            const inputs = document.querySelectorAll(".input-files")

            for (const input of inputs) {
                if (!input.files || input.files.length === 0) continue

                const formData = new FormData()
                formData.append("file", input.files[0])

                const fileRes = await fetch(`/api/laboratories/${labId}/posts/${newPostId}/documents`, {
                    method: "POST",
                    body: formData
                })

                const fileResult = await fileRes.json()
                if (!fileRes.ok) {
                    errorMessage.textContent = fileResult.error || "Ошибка при загрузке файла"
                    loadingModal.style.display = "none"
                    return
                }
            }

            window.location.href = `/app/laboratories/${labId}/posts?isLabWork=${isLabWork}`
        } catch (e) {
            console.error(e)
            errorMessage.textContent = "Произошла ошибка при отправке запроса"
        }

        loadingModal.style.display = "none"
    })
})
