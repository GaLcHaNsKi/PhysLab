import { Hono } from "hono";
import { authPageRoute } from "./auth/auth.page";
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { HeaderAuth, HeaderMain } from './components/header-main.component';
import { userPageRoute } from "./user/user.page";
import { labPageRoute } from "./laboratories/laboratories.page";

declare module 'hono' {
    interface ContextRenderer {
      (
        content: string | Promise<string>,
        props: { title: string }
      ): Response
    }
  }

export const appRoute = new Hono()

appRoute.use(
    "/*",
    jsxRenderer(({ children, title }) => {
        const c = useRequestContext()
        const isAuth = c.get("user")?.id !== undefined
        return (
            <html>
                <head>
                    <title>PhysLab | {title}</title>
                    <link rel="stylesheet" href="/public/styles.css" />
                </head>
                <body>
                    {!isAuth && <HeaderMain />}
                    {isAuth && <HeaderAuth />}
                    {children}
                    <footer>
                        <span>PhysLab# 2025</span>
                    </footer>
                </body>
            </html>
        );
    })
);

appRoute.route("/auth", authPageRoute)
appRoute.route("/user", userPageRoute)
appRoute.route("/laboratories", labPageRoute)

appRoute.get("/", (c) => {
    return c.render(
        <div class="content">
            <h1>Добро пожаловать в <acronym title='Читается как "Физ Лаб Шарп"'>PhysLab#</acronym>!</h1>
            <article>
                <h2>Что это такое?</h2>
                    <p><b>PhysLab#</b> - это веб-сервис для управления лабораториями университетов. Всё, что Вам нужно для этого - зарегистрироваться, создать лабораторию - и вперёд!</p>
                <h2>Возможности PhysLab#</h2>
                <p>Что же можно тут делать? Управлять лабораторными работами, писать посты, загружать документы, подключать сотрудников и студентов, читать чужие посты, и, используя сторонний сервис, работать с симуляторами для закрепления знаний или наглядной демонстрации физических процессов. </p>
                <p>Работайте с удовольствием!!!</p>
            </article>
        </div>,
        { title: "Main" }
    )
})

appRoute.get("/not-found", (c) => {
    return c.render(
        <div class="centered-content">
            <h1>Ошибка: запрашиваемый ресурс не найден</h1>
        </div>,
        { title: "Not Found" }
    )
})

appRoute.get("/forbidden", (c) => {
    return c.render(
        <div class="centered-content">
            <h1>Ошибка: вы не имеете доступа к этому ресурсу!</h1>
        </div>,
        { title: "Forbidden" }
    )
})