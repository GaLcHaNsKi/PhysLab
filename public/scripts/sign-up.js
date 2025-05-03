const form = document.querySelector('.auth-form')
const errorMessage = form.querySelector('.error-message')

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
        console.log(result)
        if (!resp.ok) {
            errorMessage.textContent = result.message
            return
        }
        window.location.replace('/app/user/me')
    } catch(e) {
        console.log(e)
        errorMessage.textContent = e.message
    }
}