import { Request, Response, NextFunction } from "express"

class UsersController {
    async create(request: Request, response: Response, next: NextFunction) {
        return response.status(200).json({ message: "Ok" })
    }
}

export { UsersController }