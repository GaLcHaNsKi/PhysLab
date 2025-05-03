import { Hono } from "hono";

export const authPageRoute = new Hono()


authPageRoute.get("/sign-in", (c) => {
    return c.render(
        <div class="centered-content">
            <h1>Sign In</h1>
            <form action="sign-in" class="auth-form">
                <div class="form-row">
                    <label htmlFor="nickname"><span class="required-field">Никнейм</span>: </label>
                    <input type="text" name="nickname"/>
                </div>
                <div class="form-row">
                    <label htmlFor="password"><span class="required-field">Пароль</span>: </label>
                    <input type="password" name="password"/>
                </div>
                <div className="form-row">
                    <button type="reset">Сбросить</button>
                    <button type="button" id="send">Готово!</button>
                </div>
                <span class="error-message"></span>
            </form>
            <script src="/public/scripts/sign-in.js" defer></script>
        </div>,
        { title: "Sign In" }
    )
})

authPageRoute.get("/sign-up", (c) => {
    return c.render(
        <div class="centered-content">
            <h1>Sign Up</h1>
            <form action="sign-up" class="auth-form">
                <div class="form-row">
                    <label htmlFor="nickname"><span class="required-field">Никнейм</span>: </label>
                    <input type="text" name="nickname"/>
                </div>
                <div class="form-row">
                    <label htmlFor="email"><span class="required-field">Email</span>: </label>
                    <input type="email" name="email"/>
                </div>
                <div class="form-row">
                    <label htmlFor="password"><span class="required-field">Пароль</span>: </label>
                    <input type="password" name="password"/>
                </div>
                <div class="form-row">
                    <label htmlFor="retry-password"><span class="required-field">Повторите пароль</span>: </label>
                    <input type="password" name="retry-password"/>
                </div>
                <div class="form-row">
                    <label htmlFor="name">Имя: </label>
                    <input type="text" name="name"/>
                </div>
                <div class="form-row">
                    <label htmlFor="surname">Фамилия: </label>
                    <input type="text" name="surname"/>
                </div>
                <div class="form-column">
                    <label htmlFor="aboutMe">Напишите немного о себе:</label>
                    <textarea name="aboutMe"></textarea>
                </div>
                <div className="form-row">
                    <button type="reset">Сбросить</button>
                    <button type="button" id="send">Готово!</button>
                </div>
                <span class="error-message"></span>
            </form>
            <script src="/public/scripts/sign-up.js" defer></script>
        </div>,
        { title: "Sign Up" }
    )
})