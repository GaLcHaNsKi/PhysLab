import { Hono } from 'hono'
import { serveStatic } from "hono/serve-static"
import { usersRoute } from './backend/users/users.route'
import { authRoute } from './backend/auth/auth.route'
import { authMiddleware } from './backend/auth/auth.middleware'
import { UserInfo } from './backend/users/user.types'
import { laboratoriesRoute } from './backend/laboratories/laboratories.route'
import { appRoute } from './frontend/frontend.main'
import { readFile } from "fs/promises";

const app = new Hono()

export type MiddlewareVariables = { user: UserInfo }

app.use(authMiddleware)

app.use(
  "/public/*",
  serveStatic({
    root: "./",
    getContent: async (path, c) => {
      try {
        const content = await readFile(path);
        return content; // Return Buffer
      } catch (err) {
        console.error(`Error reading file ${path}:`, err);
        return null; // Trigger onNotFound
      }
    },
    onNotFound: (path, c) => {
      console.log(`File not found: ${path}`);
      c.status(404);
      return c.text("File not found");
    },
  })
)

app.route("/api/users", usersRoute)
app.route("/api/auth", authRoute)
app.route("/api/laboratories", laboratoriesRoute)
app.route("/app", appRoute)

app.get('/', (c) => {
  return c.text('Hello from PhysLab!')
})

export default app
