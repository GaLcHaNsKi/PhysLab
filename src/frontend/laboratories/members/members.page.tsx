import { Hono } from "hono"
import { MiddlewareVariables } from "../../.."
import { LoadingAtom } from "../../components/loading-atom.component"

export const membersPageRoute = new Hono<{ Variables: MiddlewareVariables }>()

membersPageRoute.get("/", async (c) => {
    const labId = parseInt(c.req.param("labId") || "a")
    if (isNaN(labId)) return c.redirect("/app/not-found")

    return c.render(
        <div class="content" labId={labId}>
            <a href={`/app/laboratories/${labId}`}>К лаборатории</a>
            <div class="title-with-tool-button">
                <h2>Лаборатории</h2>
                <div className="tool-button"><img src="/public/icons/prev.svg" id="prev-tool" /></div>
                <span id="page-number">0</span>
                <div className="tool-button"><img src="/public/icons/next.svg" id="next-tool" /></div>
            </div>

            <form className="title-with-tool-button" id="filter-form">
                <input type="text" name="nickname" placeholder="Никнейм" />
                <input type="text" name="name" placeholder="Имя" />
                <input type="text" name="surname" placeholder="Фамилия" />
                <input type="email" name="email" placeholder="Email" />
                <select name="roleId" id="role-select">
                    <option value="">Все роли</option>
                </select>
                <button type="button" id="filter-button">Фильтровать</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Никнейм</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Роль</th>
                    </tr>
                </thead>
                <tbody id="members-list"></tbody>
            </table>
            
            <LoadingAtom />
            <script src="/public/scripts/load-members.js" defer></script>
        </div>,
        { title: "Участники" }
    )
})
