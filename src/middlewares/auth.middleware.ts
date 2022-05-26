import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/error";
import config from "../utils/config"
import { verifyJWT } from "../utils/user";
import { User } from "../dtos";
import { userService } from "../services";

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.auth_token || req.headers?.authorization?.split(" ")[1]

    if(!token) {
        return next(new CustomError("TokenNotFoundError", "The auth token is missing!", 401))
            
    }

    const [userId, jwtError] = verifyJWT<Pick<User, "id">>(token, config.JWT_SECRET)

    if(jwtError) {
        return next(jwtError)
    }

    const [user, userError] = await userService.fetchUser(userId?.id as number)

    if(userError) {
        return next(userError)
    }

    //@ts-ignore
    req.user = {
            data: {
                ...user!,
                authToken: token as string
            }
        }
    
    next()
}

export default authMiddleware