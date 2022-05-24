import { Message } from "../dtos"
import prismaClient from "../db"


export const addMessage = async(chatId: number, {message, senderId, voiceMessageAudioPath, isVoiceMessage}: Omit<Message, "id">): Promise<[Message|null, unknown]> => {
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
            by: ["createdDate"], //change to createdAt
            orderBy: {
               createdDate: "asc"
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


export const updateMessageStatus = async(messageId: number, status: "SENT"|"DELIVERED"|"SEEN") => {
    try {
        const message = await prismaClient.message.update({
            data: {
                messageStatus: status
            }, 
            where: {
                id: messageId
            }
        })
        return [message.messageStatus, null]
    } catch(err) {
        return [null, err]
    }

}