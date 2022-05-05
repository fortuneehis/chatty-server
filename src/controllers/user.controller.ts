import { NextFunction, Request, Response } from "express";
import { userService } from "../services";




export const createUser = async(req: Request, res: Response, next: NextFunction) => {
    const { username, password} = req.body
    const [_, error] = await userService.createUser({username, password}) 

    if(error) {
        return next(error)
    }

    res.json({
        message: "You account has been created!"
    })
}


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

    const { username, password } = req.body

    const [authToken, error] = await userService.authenticateUser({username, password})

    if(error) {
        return next(error)
    }

    res.cookie("auth_token", authToken as string, {
        httpOnly: true
    }).json({
        authToken
    })
}