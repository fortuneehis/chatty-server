import { NextFunction, Request, Response } from "express";
import { userService } from "../services";
import CustomError from "../utils/error";


export const createUser = async(req: Request, res: Response, next: NextFunction) => {
    const { username, password, profileImgUrl} = req.body
    const [_, error] = await userService.createUser({username, password, profileImgUrl}) 

    if(error) {
        return next(error)
    }

    res.json({
        success: true,
        message: "You account has been created!"
    })
}


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

    const { username, password } = req.body

    const [user, error] = await userService.authenticateUser({username, password})

    if(error || !user) {
        return next(error)
    }

    res.cookie("auth_token", user?.authToken as string, {
        httpOnly: true
    }).json({
        success: true,
        user
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
    const filePath = `${protocol}://${host}/${file?.filename}`

    res.json({
        success: true,
        filePath
    })

}

export const authenticatedUser = (req: Request, res: Response, next: NextFunction) => {

    //@ts-ignore
    const user = req.user

    res.json({
        success: true,
        user
    })
}
