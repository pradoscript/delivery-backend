import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { compare } from "bcrypt"
import { authConfig } from "@/configs/auth"
import { sign, SignOptions } from "jsonwebtoken"
import z from "zod"

class SessionsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = bodySchema.parse(request.body)

        const userWithEmail = await prisma.user.findFirst({ where: { email } })

        if (!userWithEmail) {
            throw new AppError("Email or/and Password invalid!", 401)
        }

        const passwordMatched = await compare(password, userWithEmail.password)

        if (!passwordMatched) {
            throw new AppError("Email or/and Password invalid!", 401)
        }

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({ role: userWithEmail.role ?? "customer" }, secret, {
            subject: userWithEmail.id,
            expiresIn
        } as SignOptions)

        const { password: hashedPassword, ...userWithoutPassword } = userWithEmail


        return response.json({ token, user: userWithoutPassword })
    }
}

export { SessionsController }