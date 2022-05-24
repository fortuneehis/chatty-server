import { NextFunction, Request, Response } from "express"
import {chatService} from "../services/index"

export const getChats = async(req: Request, res: Response, next: NextFunction) => {

    //@ts-ignore
    const { id } = req.user.data

    if(req.query.user_id) {
        const [chat, error] = await chatService.getChatDetails(id, parseInt(req.query.user_id as string, 10))

        if(error) {
            return next(error)
        }

        return res.json({
            success: true,
            chat
        })

    } 

    //@ts-ignore
    const [chats, error] = await chatService.getChats(id)

    if(error) {
        return next(error)
    }

    res.json({
        success: true,
        chats
    })
}


