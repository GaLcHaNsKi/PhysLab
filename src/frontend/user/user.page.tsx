import { Hono } from "hono";
import { MiddlewareVariables } from "../..";
import { getFilteredLaboratories, getLaboratoriesByUserId } from "../../backend/laboratories/laboratories.service";
import { Posts } from "../components/posts-list.component";

export const userPageRoute = new Hono<{Variables: MiddlewareVariables}>()

userPageRoute.get("/me", async (c) => {
    const labs = await getLaboratoriesByUserId(c.get("user").id)
    const ownLabs = await getFilteredLaboratories(1, 100, { authorNickname: c.get("user").nickname })

    return c.render(
        <div className="content">
            <h1>Привет, {c.get("user").nickname}!</h1>
            <section class="elem-list">
                <div className="title-with-tool-button">
                    <h2>О Вас</h2>
                    <div className="tool-button"><img src="/public/icons/pencil.svg" id="edit-tool"/></div>
                </div>
                <div class="title-with-tool-button">
                    <label htmlFor="nickname">Никнейм:</label>
                    <input type="text" name="nickname" value={c.get("user").nickname} disabled/>
                </div>
                <div class="title-with-tool-button">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={c.get("user").email} disabled/>
                </div>
                <div class="title-with-tool-button">
                    <label htmlFor="name">Имя:</label>
                    <input type="text" name="name" value={c.get("user").name || ""} disabled/>
                </div>
                <div class="title-with-tool-button">
                    <label htmlFor="surname">Фамилия:</label>
                    <input type="text" name="surname" value={c.get("user").surname || ""} disabled/>
                </div>
                <div class="form-column">
                    <label htmlFor="aboutMe">Ваше описание:</label>
                    <textarea name="aboutMe" disabled>{c.get("user").aboutMe || ""}</textarea>
                </div>
                <div class="title-with-tool-button">
                    <button id="send">Готово</button>
                    <button id="cancel">Отмена</button>
                </div>
                <span class="error-message"></span>
            </section>
            <section class="elem-list" id="lab-list">
                <h2>Лаборатории, где вы являетесь участником</h2>
                {(!labs || labs.length === 0) && <span>Тут пока ничего нет...</span>}
                {...labs.map((lab) =>
                        <a href={`/app/laboratories/${lab.laboratory.id}`} lab-id={lab.laboratory.id}>{lab.laboratory.name}</a>
                )}
            </section>
            
            <section class="elem-list"  id="own-lab-list">
                <h2>Ваши лаборатории</h2>
                {(!ownLabs || ownLabs.length === 0) && <span>Тут пока ничего нет...</span>}
                {...ownLabs.map((lab) =>
                    <div class="title-with-tool-button">
                        <a href={`/app/laboratories/${lab.id}`}>{lab.name}</a>
                        <div className="tool-button"><img src="/public/icons/trash.svg" class="delete-tool" lab-id={lab.id}/></div>
                    </div>
                )}
                <a href="/app/laboratories/create">Создать лабораторию</a>
            </section>
            <Posts name="Ваши посты из всех лабораторий" isSelf={true}/>
            4. Выход
            5. Удалить аккаунт
            <script src="/public/scripts/user-me.js" defer></script>
        </div>,
        { title: "Home" }
    )
})