import { Hono } from "hono";
import { postsPageRoute } from "./posts/posts.page";

export const labPageRoute = new Hono()

labPageRoute.route("/:labId/posts", postsPageRoute)

labPageRoute.get("/create", (c) => {
    return c.render(
        <div class="centered-content">
            <h1>Создать лабораторию</h1>
            <form class="auth-form" id="create-lab-form">
                <div class="form-row">
                    <label htmlFor="name"><span class="required-field">Название</span>:</label>
                    <input type="text" name="name" max-length="100" required />
                </div>
                <div class="form-column">
                    <label htmlFor="description">Описание:</label>
                    <textarea name="description" max-length="500"></textarea>
                </div>
                <div class="form-row">
                    <label htmlFor="visibility">Видимость:</label>
                    <select name="visibility">
                        <option value="PUBLIC">Публичная</option>
                        <option value="PRIVATE">Приватная</option>
                    </select>
                </div>
                <div class="form-column">
                    <button type="reset">Сбросить</button>
                    <button type="button" id="submit">Создать</button>
                </div>
                <span class="error-message" id="error-message"></span>
            </form>
            <script src="/public/scripts/create-lab.js" defer></script>
        </div>,
        { title: "Создание лаборатории" }
    )
})

labPageRoute.get("/:id", (c) => {
    const id = c.req.param("id")

    return c.render(
        <div class="content-with-menu">
            <nav>
                <menu>Меню
                    <li id="go-to-posts">Посты</li>
                    <li id="go-to-laboratories">Лабораторные</li>
                </menu>
            </nav>
            <article>
                <h1 id="lab-name">{id}</h1>
                <p id="description"></p>
            </article>

            <script src="/public/scripts/load-lab.js" defer></script>
        </div>,
        { title: "Laboratory" }
    )
})

labPageRoute.get("/", (c) => {
    // список лабораторий
    return c.render(
        <section class="elem-list" id="load-posts">
            <div class="title-with-tool-button">
                <h2>Лаборатории</h2>
                <div className="tool-button"><img src="/public/icons/prev.svg" id="prev-tool"/></div>
                <span id="page-number">0</span>
                <div className="tool-button"><img src="/public/icons/next.svg" id="next-tool"/></div>
            </div>

            <div className="title-with-tool-button">
                <div class="form-row">
                    <label htmlFor="name">Название:</label>
                    <input type="text" name="name" max-length="100" />
                </div>
                <div class="form-row">
                    <label htmlFor="authorNickname">Автор:</label>
                    <input type="text" name="nickname" max-length="100" />
                </div>
                <button id="submit">Искать</button>
            </div>

            <div class="elem-list" id="lab-list">
                <span>Ничего нет...</span>
            </div>
            <script src="/public/scripts/load-labs.js"></script>
        </section>,
        { title: "Список" }
    )
})