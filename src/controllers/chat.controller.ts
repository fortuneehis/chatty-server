
import { NextFunction, Request, Response } from "express"
import {chatService} from "../services/index"


export const getChats = async(req: Request, res: Response, next: NextFunction) => {

    //@ts-ignore
    const { id } = req.user

    const [chats, error] = await chatService.getChats(id)
    if(error) {
        return next(error)
    }

    res.status(200).json({
        chats
    })
}

