const errorMessage = document.querySelector('.error-message')
const sendButton = document.getElementById("send")
const cancelButton = document.getElementById("cancel")
const editTool = document.getElementById("edit-tool")
const nicknameInput = document.getElementsByName("nickname")[0]
const emailInput = document.getElementsByName("email")[0]
const nameInput = document.getElementsByName("name")[0]
const surnameInput = document.getElementsByName("surname")[0]
const aboutMeInput = document.getElementsByName("aboutMe")[0]

sendButton.style.display = "none"
cancelButton.style.display = "none"

editTool.onclick = (event) => {
    sendButton.style.display = "inline-block"
    cancelButton.style.display = "inline-block"

    nicknameInput.disabled = false
    emailInput.disabled = false
    nameInput.disabled = false
    surnameInput.disabled = false
    aboutMeInput.disabled = false
}

const oldValues = {
    nickname: nicknameInput.value,
    email: emailInput.value,
    name: nameInput.value,
    surname: surnameInput.value,
    aboutMe: aboutMeInput.value
};

function hide() {
    sendButton.style.display = "none"
    cancelButton.style.display = "none"

    nicknameInput.disabled = true
    emailInput.disabled = true
    nameInput.disabled = true
    surnameInput.disabled = true
    aboutMeInput.disabled = true
}

sendButton.onclick = async (event) => {
    const nickname = nicknameInput.value.trim();
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const aboutMe = aboutMeInput.value.trim();

    if (!email) {
        errorMessage.textContent = "Email обязателен!";
        return;
    }
    if (!nickname) {
        errorMessage.textContent = "Никнейм обязателен!";
        return;
    }
    errorMessage.textContent = "";

    // send to server
    try {
        const resp = await fetch("/api/users/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname, email, name, surname, aboutMe
            })
        });

        const result = await resp.json();
        console.log(result);
        if (!resp.ok) {
            errorMessage.textContent = result.error
            return
        }
    } catch (e) {
        console.log(e)
        errorMessage.textContent = e.message
    }
    
    hide()
};

cancelButton.onclick = (event) => {
    nicknameInput.value = oldValues.nickname;
    emailInput.value = oldValues.email;
    nameInput.value = oldValues.name;
    surnameInput.value = oldValues.surname;
    aboutMeInput.value = oldValues.aboutMe;

    hide()
};

document.querySelectorAll(".delete-tool").forEach(btn => {
    btn.onclick = async () => {
        const labId = btn.getAttribute("lab-id")
        const confirmed = confirm("Вы уверены, что хотите удалить лабораторию? Это действие необратимо.")

        if (!confirmed) return

        try {
            const resp = await fetch(`/api/laboratories/${labId}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const result = await resp.json();
                alert("Ошибка при удалении: " + (result.error || "Неизвестная ошибка"))
                return
            }

            // Удаляем из DOM
            const tags = Array.from(document.getElementsByTagName("a"))
            tags.forEach((tag) => {
                if (tag.getAttribute("lab-id") == labId) tag.remove()
            })
            btn.closest(".title-with-tool-button").remove()

            const labList = document.getElementById("lab-list")
            if (labList.children.length == 1) {
                const span1 = document.createTextNode("Тут пока ничего нет...")
                const span2 = document.createTextNode("Тут пока ничего нет...")

                labList.appendChild(span1)
                document.getElementById("own-lab-list").appendChild(span2)
            }
        } catch (e) {
            console.error(e)
            alert("Не удалось удалить лабораторию: " + e.message)
        }
    }
})

