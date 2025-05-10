document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("create-lab-form")
    const errorMessage = document.getElementById("error-message")
    const labId = form.getAttribute("labId")
    const loadingModal = document.getElementById("loading")

    // Загрузка данных лаборатории
    try {
        const res = await fetch(`/api/laboratories/${labId}`)
        if (res.ok) {
            const lab = await res.json()
            form.name.value = lab.name || ""
            form.description.value = lab.description || ""
            form.visibility.value = lab.visibility || "PRIVATE"
        } else {
            errorMessage.textContent = "Не удалось загрузить данные лаборатории."
        }
    } catch (e) {
        errorMessage.textContent = "Произошла ошибка при загрузке лаборатории."
    }

    loadingModal.style.display = "none"

    document.getElementById("submit").onclick = async () => {
        const name = form.name.value.trim()
        const description = form.description.value.trim()
        const visibility = form.visibility.value

        if (!name || name.length > 100) {
            errorMessage.textContent = "Название обязательно и должно быть не длиннее 100 символов."
            loadingModal.style.display = "none"
            return
        }

        if (description.length > 500) {
            errorMessage.textContent = "Описание не может быть длиннее 500 символов."
            loadingModal.style.display = "none"
            return
        }

        loadingModal.style.display = "flex"

        try {
            const response = await fetch(`/api/laboratories/${labId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, description, visibility })
            })

            const data = await response.json()

            if (!response.ok) {
                document.body.innerHTML = `
                    <h1>У-у-упс, ошибка!</h1>
                    <h2>${response.status} ${response.statusText}</h2>
                    <p>${data.error || "Что-то пошло не так..."}</p>
                `
                loadingModal.style.display = "none"
                return
            }

            // Переход обратно к лаборатории
            window.location.href = `/app/laboratories/${labId}`
        } catch (e) {
            document.body.innerHTML = `
                <h1>У-у-упс, ошибка!</h1>
                <p>${e}</p>
            `
        }
        loadingModal.style.display = "none"
    }
})
