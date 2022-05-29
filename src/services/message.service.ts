import { Message } from "../dtos"
import prismaClient from "../db"


export const addMessage = async(chatId: number, {message, senderId, voiceMessageAudioPath, isVoiceMessage, parentId}: Omit<Message, "id">): Promise<[any|null, unknown]> => {
    try {
        const newMessage = await prismaClient.message.create({
            select: {
                id: true,
                message: true,
                messageStatus: true,
                isVoiceMessage: true,
                voiceMessageAudioPath: true,
                createdAt: true,
                parent: {
                    select: {
                        id: true,
                        isVoiceMessage: true,
                        message: true,
                        sender: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            } ,
            data: {
                isVoiceMessage:  isVoiceMessage,
                voiceMessageAudioPath: isVoiceMessage ? voiceMessageAudioPath : undefined,
                parent: parentId ? {
                    connect: {
                        id: parentId as number
                    }
                } : undefined,
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


export const getMessages = async(chatId: number): Promise<[any|null, unknown]> => {
    try {
 
        const messages = await prismaClient.message.findMany({
            select: {
                id: true,
                message: true,
                messageStatus: true,
                isVoiceMessage: true,
                voiceMessageAudioPath: true,
                createdAt: true,
                parent: {
                    select: {
                        id: true,
                        isVoiceMessage: true,
                        message: true,
                        sender: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            } ,
            orderBy: {
                createdAt: "asc",
                
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

export const getMessage = async(messageId: number): Promise<[{id: number}|null, unknown]> => {
    try {
 
        const message = await prismaClient.message.findUnique({
            select: {
                id: true
            },
            where: {
                id: messageId
            }
        })

        return [message, null]

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