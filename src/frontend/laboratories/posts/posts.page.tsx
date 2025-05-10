import { Hono } from "hono";
import { MiddlewareVariables } from "../../..";
import { Posts } from "../../components/posts-list.component";
import { PostEditor } from "../../components/post-editor.component";
import { checkPermission } from "../../../backend/laboratories/laboratories.service";
import { CreateComment } from '../../components/comments/create-comment.component';
import { LoadingAtom } from "../../components/loading-atom.component";

export const postsPageRoute = new Hono<{ Variables: MiddlewareVariables }>()

postsPageRoute.get("/", async (c) => {
    const labId = parseInt(c.req.param("labId") || "a")
    if (isNaN(labId)) return c.redirect("/app/not-found")

    const isLabWork = c.req.query("isLabWork") === "true"

    const doesHasPermissionToCreate = isLabWork ? await checkPermission(labId, "create_laboratory_work", c.get("user").id) : await checkPermission(labId, "create_post", c.get("user").id)

    return c.render(
        <div class="content">
            <LoadingAtom />
            <a href={`/app/laboratories/${labId}`}>К лаборатории</a>
            <Posts name={isLabWork ? "Список лабораторных" : "Список постов"} labId={labId} isLabWork={isLabWork} doesHasPermissionToCreate={doesHasPermissionToCreate} />
        </div>,
        { title: "Посты" }
    )
})

postsPageRoute.get("/create", (c) => {
    const labId = c.req.param("labId")
    const isLabWork = c.req.query("isLabWork") === "true"
    return c.render(
        <div class="content">
            <LoadingAtom />
            <h1>Путь в тысячу строк начинается с одного слова...</h1>
            <PostEditor labId={labId} isLabWork={isLabWork} />
        </div>,
        { title: "Создать пост" }
    )
})

postsPageRoute.get("/:postId/edit", (c) => {
    const labId = c.req.param("labId")
    const postId = c.req.param("postId")
    const isLabWork = c.req.query("isLabWork") === "true"
    return c.render(
        <div class="content">
            <LoadingAtom />
            <h1>Путь в тысячу строк начинается с одного слова...</h1>
            <PostEditor labId={labId} isLabWork={isLabWork} postId={postId} />
        </div>,
        { title: "Редактировать пост" }
    )
})

postsPageRoute.get("/:id", async (c) => {
    const id = +c.req.param("id")
    const userId = c.get("user").id
    const labId = +c.req.param("labId")!
    const isLabWork = c.req.query("isLabWork") === "true"
    const canWriteComments = await checkPermission(labId, "create_moderated_comment", userId) ||
        await checkPermission(labId, "create_comment", userId)
    
    return c.render(
        <div class="content" postId={id} labId={labId} isLabWork={isLabWork}>
            <a href={`/app/laboratories/${labId}`}>К лаборатории</a>
            <h1 id="post-title"></h1>
            <div class="post-content"></div>
            <hr />
            <div className="form-row"></div>
            <div class="simLink"><a id="simLink" href="" target="_blank">Симулятор</a></div>
            <div className="files-container"></div>
            <CreateComment postId={id}/>
            <div class="elem-list">
                <div className="form-row">
                    <h3>Комментарии</h3>
                    {canWriteComments && <button id="openModal">Написать</button>}
                </div>
                <span class="error-message"></span>
                <div id="comments" class="elem-list"></div>
            </div>
            
            <LoadingAtom />
            <script src="/public/scripts/load-post-by-id.js" defer></script>
            <script src="/public/scripts/load-post-comments.js" defer></script>
        </div>,
        { title: "Посты" }
    )
})