import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controller"
import { Router } from "express"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAutentication } from "@/middlewares/verify-user-autentication"

const deliveriesLogsRoutes = Router()
const deliveriesLogsController = new DeliveriesLogsController()

deliveriesLogsRoutes.post("/", ensureAuthenticated, verifyUserAutentication(["sale"]), deliveriesLogsController.create)
deliveriesLogsRoutes.get("/:delivery_id/show", ensureAuthenticated, verifyUserAutentication(["sale", "customer"]), deliveriesLogsController.show)

export { deliveriesLogsRoutes }