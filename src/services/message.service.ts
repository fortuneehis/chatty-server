import { Message } from "../dtos"
import prismaClient from "../db"


export const addMessage = async(chatId: number, {message, senderId, voiceMessageAudioPath, isVoiceMessage}: Message): Promise<[Message|null, unknown]> => {
    try {
        const newMessage = await prismaClient.message.create({
            data: {
                isVoiceMessage:  isVoiceMessage,
                voiceMessageAudioPath: isVoiceMessage ? voiceMessageAudioPath : undefined,
                message,
                sender: {
                    connect: {
                        id: senderId
                    }
                },
                chat: {
                    connect: {
                        id: chatId
                    }
                }
            }
        })

        return [newMessage, null]
    } catch(err) {
        return [null, err]
    }
}

export const getMessages = async(chatId: number) => {
    try {
        //add createdAt column
        const messages = await prismaClient.message.groupBy({
            by: ["chatId"], //change to createdAt
            orderBy: {
               chatId: "asc"
            },
            where: {
                chat: {
                    id: chatId
                }
            }
        })

        return [messages, null]

    } catch(err) {
        return [null, err]
    }
}