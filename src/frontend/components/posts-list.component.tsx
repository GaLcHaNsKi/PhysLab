export function Posts({ name, labId, isLabWork, isSelf }: any) {
    return (
        <section class="elem-list" id="load-posts" labId={labId} isSelf={isSelf} isLabWork={isLabWork}>
            <div class="title-with-tool-button">
                <h2>{name}</h2>
                <div className="tool-button"><img src="/public/icons/prev.svg" id="prev-tool"/></div>
                <span id="page-number">0</span>
                <div className="tool-button"><img src="/public/icons/next.svg" id="next-tool"/></div>
            </div>

            <div className="title-with-tool-button">
                <label>
                    Title:
                    <input type="text" name="title" />
                </label>
                {!isSelf &&
                    <label>
                        Author Nickname:
                        <input type="text" name="authorNickname" />
                    </label>
                }
                <label>
                    Tags:
                    <input type="text" name="tags" placeholder="Comma-separated" />
                </label>
                {isLabWork && (
                    <>
                        <label>
                            Course:
                            <input type="number" name="course" min="1" max="4" />
                        </label>
                        <label>
                            Semester:
                            <select name="semester">
                                <option value="">Select</option>
                                <option value="AUTUMN">Autumn</option>
                                <option value="SPRING">Spring</option>
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
