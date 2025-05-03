const form = document.querySelector('.auth-form')
const errorMessage = form.querySelector('.error-message')

document.getElementById("send").onclick = async function (event) {
    const nickname = form.nickname.value.trim()
    const password = form.password.value

    if (!nickname || !password) {
        errorMessage.textContent = "Вы не заполнили обязательные поля! Они имеют красные заголовки."
        return
    }
    errorMessage.textContent = ""

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