import { Hono } from "hono";
import { MiddlewareVariables } from "../../..";
import { Posts } from "../../components/posts-list.component";
import { PostEditor } from "../../components/post-editor.component";

export const postsPageRoute = new Hono<{ Variables: MiddlewareVariables }>()

postsPageRoute.get("/", (c) => {
    const labId = c.req.param("labId")
    return c.render(
        <Posts name="Список постов" labId={labId}/>,
        { title: "Посты" }
    )
})

postsPageRoute.get("/create", (c) => {
    const labId = c.req.param("labId")
    return c.render(
        <div class="content">
            <h1>Путь в тысячу строк начинается с одного слова...</h1>
            <PostEditor labId={labId}/>
        </div>,
        { title: "Создать пост" }
    )
})

postsPageRoute.get("/:id", (c) => {
    return c.render(
        <div class="content">
            <h1 id="post-title"></h1>
            <div class="post-content"></div>
            <div class="comments"></div>
        </div>,
        { title: "Посты" }
    )
})