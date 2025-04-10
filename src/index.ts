import { Hono } from 'hono'
import { usersRoute } from './users/users.route'
import { authRoute } from './auth/auth.route'
import { authMiddleware } from './auth/auth.middleware'
import { UserInfo } from './users/user.types'
import { laboratoriesRoute } from './laboratories/laboratories.route'

const app = new Hono()

export type MiddlewareVariables = { user: UserInfo }

app.use(authMiddleware)

app.route("/users", usersRoute)
app.route("/auth", authRoute)
app.route("/laboratories", laboratoriesRoute)

app.get('/', (c) => {
  return c.text('Hello from PhysLab!')
})

export default app
