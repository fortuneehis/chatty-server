import { userService } from "."
import prismaClient from "../db"
import { User } from "../dtos"
import CustomError from "../utils/error"

export const getChats = async(userId: number): Promise<[{ user: User}[]|null, unknown]> => {

    try {
        const chats = await prismaClient.chat.findMany({
            orderBy: {
                updatedAt: "desc"
            },
            include: {
                messages: {
                    select: {
                        message: true,
                        messageStatus: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                  
                },
                users: {
                    select: {
                        
                        user: {
                            
                            select: {
                                id: true,
                                username: true,
                                profileImgUrl: true,
                                status: true
                            }
                        },
                        
                    }
                },
               
            },
            where: {
                users: {
                    some: {
                        user: {
                            id: userId
                        }
                    }
                }
            }
        })

        
        const filteredChat = chats.map(chat=> {
           return ({
               id: chat.id,
               recentMessage: chat.messages[0],
               user: chat.users.find(user=> user.user.id != userId)
           })
        })

        return [filteredChat as any, null]
    } catch(err) {
        return [null, err]
    }
}

export const chatExists = async(currentUserId: number, otherUserId: number): Promise<[any, unknown]> => {

    try {

        if(currentUserId === otherUserId) {
            throw new CustomError("ChatError", "Self chatting is not allowed!", 403)
        }

        
        const chat = await prismaClient.chat.findFirst({
            where: {
                users: {
                    some: {
                        user: {
                            id: currentUserId
                        }
                    }
                },
                AND: {
                    users: {
                        some: {
                            user: {
                                id: otherUserId
                            }
                        }
                    },
                }
            }
        })


        return [chat, null]
    } catch(err) {
        return [null, err]
    }
}

export const addChat = async(currentUserId: number, otherUserId: number) => {
    try {
        
        if(currentUserId === otherUserId) {
            throw new CustomError("ChatError", "Self chatting is not allowed!", 403)
        }

        const chat = await prismaClient.chat.create({
            data: {
                users: {
                    create: [
                        {
                            user: {
                                connect: {
                                    id: currentUserId
                                }
                            }
                        },
                        {
                            user: {
                                connect: {
                                    id: otherUserId
                                }
                            }
                        }
                    ]
                    }
                }
        })

        return [chat, null]

    } catch(err: any) {

        return [null, err]

    }
}

export const getRecentChat = async(chatId: number, userId: number) => {
    try {
        const chat = await prismaClient.chat.update({
            data: {
                updatedAt: new Date()
            },
            include: {
                messages: {
                    select: {
                        message: true,
                        messageStatus: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                  
                },
                users: {
                    select: {    
                        user: {           
                            select: {
                                id: true,
                                username: true,
                                profileImgUrl: true,
                            }
                        },
                        
                    }
                },
               
            },
            where: {
                id: chatId
            }
        })

        if(!chat) {
            return [null, null]
        }
         return [{
            id: chat?.id,
            recentMessage: chat?.messages[0],
            user: chat?.users.filter(user=> user.user.id != userId)[0]
        } as any, null]
    } catch(err) {
        return [null, err]
    }
}


