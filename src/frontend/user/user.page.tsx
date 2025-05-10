import { Hono } from "hono";
import { MiddlewareVariables } from "../..";
import { getFilteredLaboratories, getLaboratoriesByUserId } from "../../backend/laboratories/laboratories.service";
import { Posts } from "../components/posts-list.component";
import { getUserById } from "../../backend/users/user.service";
import { undefinedAnswer } from "../../answers";
import { LoadingAtom } from '../components/loading-atom.component';

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
                <h3>Лаборатории, где вы являетесь участником</h3>
                {(!labs || labs.length === 0) && <span>Тут пока ничего нет...</span>}
                {...labs.map((lab) =>
                        <a href={`/app/laboratories/${lab.laboratory.id}`} lab-id={lab.laboratory.id}>{lab.laboratory.name}</a>
                )}
            </section>
            
            <section class="elem-list"  id="own-lab-list">
                <h3>Ваши лаборатории</h3>
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

            <LoadingAtom/>
            <script src="/public/scripts/user-me.js" defer></script>
        </div>,
        { title: "Home" }
    )
})

userPageRoute.get("/:id", async (c) => {
    const id = +c.req.param("id")
    if (isNaN(id)) return c.json({ error: "Incorrect ID" }, 400)
    
    const user = await getUserById(id)
    if (!user) return c.json(undefinedAnswer, 404)
    
    const labs = await getLaboratoriesByUserId(id)
    const ownLabs = await getFilteredLaboratories(1, 100, { authorNickname: user.nickname })
    
    return c.render(
        <div className="content">
            <section class="elem-list">
                <h2>О пользователе</h2>
                <span>Никнейм: {user.nickname}</span>
                <span>Email: {user.email}</span>
                {user.name && <span>Имя: {user.name}</span>}
                {user.surname && <span>Фамилия: {user.surname}</span>}
                {user.aboutMe && <p>Описание: {user.aboutMe}</p>}
            </section>
            <section class="elem-list" id="lab-list">
                {(labs.length !== 0) &&
                <>
                    <h3>Лаборатории, в которых {user.nickname} учавствует</h3>
                    {...labs.map((lab) =>
                            <a href={`/app/laboratories/${lab.laboratory.id}`} lab-id={lab.laboratory.id}>{lab.laboratory.name}</a>
                    )}
                </>
                }
            </section>
            
            <section class="elem-list"  id="own-lab-list">
                {(ownLabs.length !== 0) &&
                <>
                    <h3>Лаборатории, принадлежащие {user.nickname}</h3>
                    {...ownLabs.map((lab) =>
                        <a href={`/app/laboratories/${lab.id}`}>{lab.name}</a>
                    )}
                    <a href="/app/laboratories/create">Создать лабораторию</a>
                </>
                }
            </section>
            <LoadingAtom/>
            <Posts name="Посты" isSelf={true} author={user.nickname}/>
        </div>,
        { title: user.nickname }
    )
})