import { NextFunction, Request, Response } from "express"
import {chatService, messageService, userService} from "../services/index"
import CustomError from "../utils/error"

export const getChats = async(req: Request, res: Response, next: NextFunction) => {

    //@ts-ignore
    const { id } = req.user.data

    if(req.query.user_id) {
        const userId = req.query.user_id as string
        const [user, userError] = await userService.fetchUser(parseInt(userId, 10))

        if(userError) {
            return next(userError)
        }

        if(!user) {
            throw new CustomError("UserNotFound", "User does not exist!", 404)
        }

        let [chat, chatError] = await chatService.chatExists(id, parseInt(req.query.user_id as string, 10))

        if(chatError) {
            return next(chatError)
        }

        if(chat) {
            const [messages, messagesError] = await messageService.getMessages(chat.id)

            if(messagesError) {
                return next(messagesError)
            }

            chat = {
                ...chat,
                messages
            }
        }

        

        return res.json({
            success: true,
            data: {
                user,
                chat
            }
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


