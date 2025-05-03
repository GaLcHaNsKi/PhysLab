document.getElementById("submit").onclick = async () => {
    const form = document.getElementById("create-lab-form")
    const errorMessage = document.getElementById("error-message")

    const name = form.name.value.trim()
    const description = form.description.value.trim()
    const visibility = form.visibility.value

    if (!name || name.length > 100) {
        errorMessage.textContent = "Название обязательно и должно быть не длиннее 100 символов."
        return
    }

    if (description.length > 500) {
        errorMessage.textContent = "Описание не может быть длиннее 500 символов."
        return
    }

    try {
        const response = await fetch("/api/laboratories", {
            method: "POST",
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
            return
        }

        // Переход на страницу новой лаборатории
        window.location.href = `/app/laboratories/${data.id}`
    } catch (e) {
        document.body.innerHTML = `
            <h1>У-у-упс, ошибка!</h1>
            <p>${e}</p>
        `
    }
}
