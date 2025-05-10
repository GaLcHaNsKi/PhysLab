const form = document.querySelector('.auth-form')
const errorMessage = form.querySelector('.error-message')
const loadingModal = document.getElementById("loading")

loadingModal.style.display = "none"

document.getElementById("send").onclick = async function (event) {
    const nickname = form.nickname.value.trim()
    const password = form.password.value

    if (!nickname || !password) {
        errorMessage.textContent = "Вы не заполнили обязательные поля! Они имеют красные заголовки."
        return
    }
    errorMessage.textContent = ""

    loadingModal.style.display = "flex"
    // send to server
    try {
        const resp = await fetch("/api/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname, password
            })
        })

        const result = await resp.json()
        if (!resp.ok) {
            errorMessage.textContent = result.message
            loadingModal.style.display = "none"
            return
        }
        window.location.replace('/app/users/me')
    } catch (e) {
        console.error(e)
        errorMessage.textContent = e.message
    }
    loadingModal.style.display = "none"
}