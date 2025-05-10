const form = document.querySelector('.auth-form')
const errorMessage = form.querySelector('.error-message')
const loadingModal = document.getElementById("loading")

loadingModal.style.display = "none"

document.getElementById("send").onclick = async function (event) {
    const nickname = form.nickname.value.trim()
    const email = form.email.value.trim()
    const password = form.password.value
    const retryPassword = form['retry-password'].value
    const name = form.name.value
    const surname = form.surname.value
    const aboutMe = form.aboutMe.value

    if (!nickname || !email || !password || !retryPassword) {
        errorMessage.textContent = "Вы не заполнили обязательные поля! Они имеют красные заголовки."
        return
    }
    if (password !== retryPassword) {
        errorMessage.textContent = "Пароли не совпадают!"
        return
    }
    errorMessage.textContent = ""

    loadingModal.style.display = "flex"
    // send to server
    try {
        const resp = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname, email, password, name, surname, aboutMe
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