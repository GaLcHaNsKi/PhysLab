export function PostEditor({ labId, isLabWork, postId }: any) {
    return (
        <div className="editor" lab-id={labId} isLabWork={isLabWork} postId={postId}>
            <div className="form-row">
                <input type="text" id="post-title" placeholder="Название"/>
                {isLabWork && (
                    <>
                        <label>
                            Курс:
                            <select name="course">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </label>
                        <label>
                            Семестр:
                            <select name="semester">
                                <option value="AUTUMN">Осенний</option>
                                <option value="SPRING">Весенний</option>
                            </select>
                        </label>
                    </>
                )}
            </div>

            <textarea name="body" id="post-body" placeholder="Текст, много текста...">
            </textarea>

            <label>Теги:
                <input type="text" id="tags" placeholder="Через запятую"/>
            </label>

            <div className="elem-list">
                <h3>Прикрепите файлы:</h3>

                <div className="elem-list" id="files">
                    <input type="file" class="input-files" id="file1" />
                </div>

                <button id="addFile">+</button>
            </div>
            
            {isLabWork &&
                <div>
                    <p>Вставьте ссылку на симулятор. Все симуляторы можно найти <a href="https://phet.colorado.edu/en/simulations/filter?subjects=physics,earth-and-space&type=html&sort=alpha" target="_blank">здесь</a></p>
                    <input type="text" name="simLink" id="simLink" placeholder="Ссылка"/>
                </div>
            }

            <input type="button" value="Сохранить" id="save"/>
            <span class="error-message"></span>

            <script src="https://cdn.tiny.cloud/1/t6ogmhb5ghurbvqyst1zjgf015rve2rc4efle7mchrwn81n2/tinymce/7/tinymce.min.js" referrerpolicy="origin"></script>
            <script src="/public/scripts/create-post.js" defer></script>
        </div>
    )
}
