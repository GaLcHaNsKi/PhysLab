const commentsContainer = document.querySelector('#comments')
const postId = document.querySelector('.content').getAttribute('postId')
const labId = document.querySelector('.content').getAttribute('labId')
const errorMessage = document.querySelector('.error-message')
const loadingModal = document.getElementById("loading")

loadingModal.style.display = "none"

async function main() {
    loadingModal.style.display = "flex"

    commentsContainer.innerHTML = ""
    try {
        const response = await fetch(`/api/laboratories/${labId}/posts/${postId}/comments`)

        if (!response.ok) throw new Error('Failed to fetch comments')
        const comments = await response.json()

        if (comments.length === 0) {
            const noComments = document.createElement('span')
            noComments.textContent = 'Пока их нет...'
            commentsContainer.appendChild(noComments)
            
            loadingModal.style.display = "none"
            return
        }

        comments.forEach(comment => {
            const commentElement = document.createElement('div')
            commentElement.className = 'comment'

            if (comment.answerId) {
                console.log(comment.answerId)
                const answerSpan = document.createElement('span')
                answerSpan.className = 'answer'
                answerSpan.textContent = `Ответ на "${comment.answer.text.slice(0, 20)}..."`
                commentElement.appendChild(answerSpan)
            }

            const bodySpan = document.createElement('span')
            bodySpan.className = 'body'
            bodySpan.textContent = comment.text
            commentElement.appendChild(bodySpan)

            const formRow = document.createElement('div')
            formRow.className = 'form-row'

            const createDateSpan = document.createElement('span')
            createDateSpan.className = 'create-date'
            createDateSpan.textContent = new Date(comment.createdAt).toLocaleString()
            formRow.appendChild(createDateSpan)

            const authorSpan = document.createElement('span')
            authorSpan.id = 'author'
            authorSpan.innerHTML = `Автор: <a href="/app/users/${comment.authorId}">${comment.author.nickname}</a>`
            formRow.appendChild(authorSpan)

            commentElement.appendChild(formRow)

            const answerButton = document.createElement('button')
            answerButton.id = 'answerComment'
            answerButton.setAttribute('commentId', comment.id)
            answerButton.textContent = 'Ответить'
            commentElement.appendChild(answerButton)

            commentsContainer.appendChild(commentElement)
        })

        document.querySelectorAll('#answerComment').forEach(button => {
            button.onclick = e => {
                const modal = document.querySelector('#modal-comments')
                const createCommentDiv = modal.querySelector('.create-comment')
                const commentId = button.getAttribute('commentId')

                createCommentDiv.setAttribute('commentId', commentId)
                modal.style.display = 'flex'
            }
        })
    } catch (error) {
        console.error('Error fetching comments:', error)

        errorMessage.textContent = 'Ошибка при загрузке комментариев: ' + error.message
    }
    loadingModal.style.display = "none"
}

const openModalButton = document.querySelector('#openModal')
if (openModalButton) {
    openModalButton.onclick = e => {
        const modal = document.querySelector('#modal-comments')
        const createCommentDiv = modal.querySelector('.create-comment')

        createCommentDiv.setAttribute('commentId', undefined)
        modal.style.display = 'flex'
    }
}

const modal = document.querySelector(".modal")
const commentBody = document.getElementById("body")

function hideModal(e) {
    modal.style.display = "none"
    commentBody.value = ""
}

document.getElementById("cancel").onclick = hideModal
hideModal()

document.getElementById("send").onclick = async _ => {
    const createCommentDiv = modal.querySelector('.create-comment')
    const commentId = createCommentDiv.getAttribute('commentId')
    const text = commentBody.value.trim()

    if (!text) {
        errorMessage.textContent = 'Комментарий не может быть пустым'
        return
    }

    const commentData = {
        text,
        postId: +postId,
        answerId: commentId ? +commentId : null,
    }

    loadingModal.style.display = "flex"
    try {
        const response = await fetch(`/api/laboratories/${labId}/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error creating comment:', errorData)
            throw new Error('Failed to create comment')
        }

        hideModal()
        main()

        errorMessage.textContent = ""
    } catch (error) {
        console.error('Error creating comment:', error)

        errorMessage.textContent = 'Ошибка при создании комментария: ' + error.message
    }
    loadingModal.style.display = "none"
}

main()