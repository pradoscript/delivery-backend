import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface TokenPayload {
    role: string
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError("JWT Token Not Found")
        }

        const [, token] = authHeader.split(" ")

        const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = {
            id: user_id,
            role,
        }
    } catch (error) {
        next(error)
    }
}

export { ensureAuthenticated }