import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import CustomError from "../utils/error";
import config from "../utils/config"
import { verifyJWT } from "../utils/user";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
        if(!req.cookies?.auth_token) {
            return next(new CustomError("TokenNotFoundError", "The auth token is missing!", 402))
            
        }

        const [user, error] = verifyJWT(req.cookies.auth_token, config.JWT_SECRET)

        if(error) {
            return next(error)
        }

        //@ts-ignore
        req.user = user
       next()
}

export default authMiddleware