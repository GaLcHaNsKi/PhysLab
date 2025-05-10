document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.querySelector('.content')
    const postTitleElement = document.getElementById('post-title')
    const postContentElement = document.querySelector('.post-content')
    const documentsContainer = document.querySelector('.files-container')
    const infoRowElement = document.querySelector('.content .form-row')
    const simLinkA = document.getElementById('simLink') // поле для ссылки на симулятор

    const postId = contentDiv.getAttribute('postId')
    const labId = contentDiv.getAttribute('labId')
    const isLabWork = contentDiv.getAttribute('isLabWork') === 'true'
    const postUrl = `/api/laboratories/${labId}/posts/${postId}?isLabWork=${isLabWork}`
    const loadingModal = document.getElementById("loading")

    try {
        const response = await fetch(postUrl)
        const postData = await response.json()

        if (!response.ok) {
            console.error('Ошибка при загрузке поста:', response.status, postData)
            loadingModal.style.display = "none"
            
            if (response.status === 404) {
                window.location.href = '/app/not-found'
            } else if (response.status === 403) {
                window.location.href = '/app/forbidden'
            } else {
                alert(`Ошибка при загрузке поста: ${postData.error || response.statusText}`)
            }
            return
        }

        if (postData) {
            postTitleElement.textContent = postData.title || 'Без названия'
            postContentElement.innerHTML = postData.text || 'Нет содержимого.'

            if (Array.isArray(postData.tags) && postData.tags.length > 0) {
                const tagsDiv = document.createElement("div")
                tagsDiv.className = "tags"
                postData.tags.forEach(tag => {
                    const tagSpan = document.createElement("span")
                    tagSpan.className = "tag"
                    tagSpan.textContent = tag
                    tagsDiv.appendChild(tagSpan)
                })
                infoRowElement.appendChild(tagsDiv)
            }

            const authorSpan = document.createElement("span")
            authorSpan.id = "author"
            if (postData.author?.id) {
                const authorLink = document.createElement("a")
                authorLink.href = `/app/users/${postData.author.id}`
                authorLink.textContent = postData.author.nickname || "неизвестен"
                authorSpan.innerHTML = "Автор: "
                authorSpan.appendChild(authorLink)
            } else {
                authorSpan.textContent = "Автор: неизвестен"
            }
            infoRowElement.appendChild(authorSpan)

            // вставляем ссылку симулятора, если есть
            if (isLabWork && postData.simulatorLink) {
                simLinkA.href = postData.simulatorLink
            } else simLinkA.style.display = "none"

            const documentsUrl = `/api/laboratories/${labId}/posts/${postId}/documents`
            try {
                const docsResponse = await fetch(documentsUrl)
                const docsData = await docsResponse.json()

                if (!docsResponse.ok) {
                    const docsErrorData = await docsResponse.json()
                    console.error('Ошибка при загрузке документов:', docsResponse.status, docsErrorData)
                    loadingModal.style.display = "none"
                    alert(`Ошибка при загрузке документов: ${docsErrorData.error || docsResponse.statusText}`)
                    return
                }

                if (Array.isArray(docsData) && docsData.length > 0) {
                    documentsContainer.style.display = "flex"
                    const filesHeading = document.createElement('h3')
                    filesHeading.textContent = 'Файлы:'
                    documentsContainer.appendChild(filesHeading)

                    docsData.forEach(docItem => {
                        if (docItem.document && docItem.link) {
                            const fileLink = document.createElement('a')
                            fileLink.href = docItem.link
                            fileLink.textContent = docItem.document.name
                            documentsContainer.appendChild(fileLink)
                        } else {
                            console.warn('Получен некорректный объект документа:', docItem)
                        }
                    })
                }
            } catch (docsError) {
                console.error('Произошла ошибка при отправке запроса на загрузку документов:', docsError)
                loadingModal.style.display = "none"
                alert('Произошла ошибка при отправке запроса на загрузку документов.')
            }

        } else {
            console.error('Запрос поста успешен, но данные поста отсутствуют.')
            loadingModal.style.display = "none"
            alert('Ошибка: Данные поста не найдены.')
        }
    } catch (error) {
        console.error('Произошла ошибка при отправке запроса на загрузку поста:', error)
        loadingModal.style.display = "none"
        alert('Произошла ошибка при отправке запроса на загрузку поста.')
    }
    loadingModal.style.display = "none"
})
