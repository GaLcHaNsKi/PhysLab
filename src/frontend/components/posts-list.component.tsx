export function Posts({ name, labId, isLabWork, isSelf, author, doesHasPermissionToCreate }: any) {
    return (
        <section class="elem-list" id="load-posts" labId={labId} isSelf={isSelf} author={author} isLabWork={isLabWork}>
            <div className="form-row">
                <div class="title-with-tool-button">
                    <h2>{name}</h2>
                    <div className="tool-button"><img src="/public/icons/prev.svg" id="prev-tool"/></div>
                    <span id="page-number">0</span>
                    <div className="tool-button"><img src="/public/icons/next.svg" id="next-tool"/></div>
                </div>
                {doesHasPermissionToCreate && <a href={`/app/laboratories/${labId}/posts/create?isLabWork=${isLabWork}`}>Создать</a>}
            </div>
            <div className="title-with-tool-button">
                <label>
                    Название:
                    <input type="text" name="title" />
                </label>
                {!isSelf &&
                    <label>
                        Автор (никнейм):
                        <input type="text" name="authorNickname" />
                    </label>
                }
                <label>
                    Теги:
                    <input type="text" name="tags" placeholder="Через запятую" />
                </label>
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
                <button id="submit">Искать</button>
            </div>

            <div class="elem-list" id="posts-list">
                <span>Тут пока ничего нет...</span>
            </div>
            <script src="/public/scripts/load-posts.js"></script>
        </section>
    )
}
