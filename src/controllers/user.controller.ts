import { NextFunction, Request, Response } from "express";
import { userService } from "../services";
import CustomError from "../utils/error";




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

export const uploadProfileImage = (req: Request, res: Response, next: NextFunction) => {

    if(!req.file) {
        //just added a random message, might change later 😅 
        return next(new CustomError("FileUploadError", "Could not find uploaded file!", 404))
    }

    const file = req.file
    const protocol = req.protocol
    const host = req.get("host")
    const filePath = `${protocol}:${host}/${file?.filename}`

    res.json({
        filePath
    })

}