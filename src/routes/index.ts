import { Router } from 'express'
import { usersRoutes } from './users-routes'
import { sessionsRoutes } from './sessions-routes'
import { deliveriesRoutes } from './deliveries-routes'
import { deliveriesLogsRoutes } from './deliveries-logs-controller'

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/deliveries", deliveriesRoutes)
routes.use("/deliveries-logs", deliveriesLogsRoutes)

export { routes }