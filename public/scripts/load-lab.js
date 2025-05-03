document.addEventListener("DOMContentLoaded", async () => {
    const labId = document.getElementById("lab-name").textContent.trim()

    try {
        const response = await fetch(`/api/laboratories/${labId}`)

        if (response.status === 404 || response.status === 400) {
            window.location.href = "/app/not-found"
            return
        }

        if (response.status === 403) {
            window.location.href = "/app/forbidden"
            return
        }

        const data = await response.json()

        if (!response.ok) {
            document.body.innerHTML = `<h1>У-у-упс, ошибка!<h1/> <h2>${response.status} ${response.status}<h2/> <p>${data.error}<p/>`
        }

        document.getElementById("lab-name").textContent = data.name
        document.getElementById("description").textContent = data.description ?? "Описание отсутствует"

        document.getElementById("go-to-posts").onclick = () => {
            window.location.href = `/app/laboratories/${labId}/posts`
        }

        document.getElementById("go-to-laboratories").onclick = () => {
            window.location.href = `/app/laboratories/${labId}/posts?isLabWork=true`
        }

    } catch (e) {
        console.error("Ошибка при получении данных лаборатории:", e)
        document.body.innerHTML = `<h1>У-у-упс, ошибка!<h1/> <p>${e}<p/>`
    }
})
