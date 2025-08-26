import { Hono } from "hono";
import { postsPageRoute } from "./posts/posts.page";
import { LabForm } from "../components/laboratory-form";
import { MiddlewareVariables } from "../..";
import { checkIsUserInLaboratory, checkPermission } from "../../backend/laboratories/laboratories.service";
import { listen } from "bun";
import { membersPageRoute } from "./members/members.page";
import { LoadingAtom } from "../components/loading-atom.component";

export const labPageRoute = new Hono<{ Variables: MiddlewareVariables }>()

labPageRoute.route("/:labId/posts", postsPageRoute)
labPageRoute.route("/:labId/members", membersPageRoute)

labPageRoute.get("/create", (c) => {
    return c.render(
        <div class="content">
            <h1>Создать лабораторию</h1>
            <LabForm />
            <LoadingAtom />
            <script src="/public/scripts/create-lab.js"></script>
        </div>,
        { title: "Создание лаборатории" }
    )
})

labPageRoute.get("/:id/edit", (c) => {
    const id = c.req.param("id")

    return c.render(
        <div className="content">
            <LabForm labId={id} />
            <LoadingAtom />
            <script src="/public/scripts/edit-lab.js" defer></script>
        </div>,
        { title: "Редактирование" }
    )
})

labPageRoute.get("/:id", async (c) => {
    const id = +c.req.param("id")
    const userId = c.get("user").id
    const isInLab = await checkIsUserInLaboratory(id, userId)
    const canEditLab = await checkPermission(id, "edit_laboratory_settings", userId)
    const canInviteAdmins = await checkPermission(id, "create_joining_admin_link", userId)
    const canInviteResearchers = await checkPermission(id, "create_joining_other_link", userId)
    const canInviteStudents = await checkPermission(id, "create_joining_student_link", userId)
    const canViewMembers = await checkPermission(id, "view_laboratory_members", userId)

    return c.render(
        <div class="content-with-menu">
            <nav>
                <menu><span class="title">Меню</span>
                    <li id="go-to-posts">Посты</li>
                    <li id="go-to-laboratories">Лабораторные</li>
                    {canViewMembers && <li id="view-members">Список учаcтников</li>}
                    {canEditLab && <li id="edit-lab">Редактировать</li>}
                    {!isInLab && <li id="join-as-guest">Присоединиться как гость</li>}
                    {isInLab &&
                        <>
                            <span className="title">Ссылки для приглашения</span>
                            {canInviteAdmins && <li id="inviting-link-as-admin">Админа</li>}
                            {canInviteResearchers && <li id="inviting-link-as-researcher">Исследователя</li>}
                            {canInviteStudents && <li id="inviting-link-as-student">Студента</li>}
                            <li id="inviting-link-as-guest">Гостя</li>
                        </>
                    }
                </menu>
            </nav>
            <article>
                <h1 id="lab-name">{id}</h1>
                <p id="description"></p>
            </article>

            <LoadingAtom />
            <script src="/public/scripts/load-lab.js" defer></script>
        </div>,
        { title: "Laboratory" }
    )
})

labPageRoute.get("/", (c) => {
    // список лабораторий
    return c.render(
        <div class="content">
            <section class="elem-list" id="load-posts">
                <div class="title-with-tool-button">
                    <h2>Список участников</h2>
                    <div className="tool-button"><img src="/public/icons/prev.svg" id="prev-tool" /></div>
                    <span id="page-number">0</span>
                    <div className="tool-button"><img src="/public/icons/next.svg" id="next-tool" /></div>
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
                
                <LoadingAtom />
                <script src="/public/scripts/load-labs.js"></script>
            </section>
        </div>,
        { title: "Список" }
    )
})