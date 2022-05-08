import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/error";
import config from "../utils/config"
import { verifyJWT } from "../utils/user";
import { User } from "../dtos";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.auth_token || req.headers?.authorization?.split(" ")[1]

    if(!token) {
        return next(new CustomError("TokenNotFoundError", "The auth token is missing!", 401))
            
    }

    const [user, error] = verifyJWT<User>(token, config.JWT_SECRET)

    if(error) {
        return next(error)
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