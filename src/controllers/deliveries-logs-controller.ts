import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import { uuid, z } from "zod"

class DeliveriesLogsController {
    async create(request: Request, response: Response, next: NextFunction) {
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string()
        })

        const { delivery_id, description } = bodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id }
        })

        if (!delivery) {
            throw new AppError("Delivery Not Found", 404)
        }

        if (delivery.status === "processing") {
            throw new AppError("Change status to shipped!")
        }

        if (delivery.status === "delivered") {
            throw new AppError("The delivery has already delivered!")
        }
        await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description
            }
        })
        return response.json({ message: "ok" })
    }

    async show(request: Request, response: Response, next: NextFunction) {
        const paramsSchema = z.object({
            delivery_id: z.string().uuid()
        })

        const { delivery_id } = paramsSchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: {
                id: delivery_id
            },
            include: {
                logs: { select: { description: true, id: true } },
                user: true
            }
        })

        if (request.user?.role === "customer" && request.user?.id !== delivery?.userId) {
            throw new AppError("The user can only view their deliveries", 401)
        }

        return response.json(delivery)
    }
}

export { DeliveriesLogsController }