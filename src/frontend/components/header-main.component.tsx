export function HeaderMain() {
    return (
        <header>
            <span class="logo"><a href="/app">PhysLab#</a></span>
            <nav class="header-nav">
                <a href="/app/auth/sign-in">Sign In</a>
                <a href="/app/auth/sign-up">Sign Up</a>
            </nav>
        </header>
    )
}
export function HeaderAuth() {
    return (
        <header>
            <nav class="header-nav">
                <h1><a href="/app">PhysLab#</a></h1>
                <a href="/app/laboratories">Laboratories</a>
            </nav>
            <nav class="header-nav">
                <a href="/app/users/me">Home</a>
            </nav>
        </header>
    )
}