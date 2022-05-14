
import prismaClient from "../db"
import { User } from "../dtos"
import { Chat }from "../dtos"
import CustomError from "../utils/error"

export const getChats = async(userId: number): Promise<[{ user: User}[]|null, unknown]> => {
    try {
        const chats = await prismaClient.chat.findMany({
            include: {
                messages: {
                    orderBy: {
                        createdDate: "desc"
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

export const getChat = async(currentUserId: number, otherUserId: number): Promise<[Chat|null, unknown]> => {
    try {

        if(currentUserId === otherUserId) {
            throw new CustomError("ChatError", "Self chatting is not allowed!", 403)
        }


        let chat = await prismaClient.chat.findFirst({
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

    } catch(err: any) {

        return [null, err]
        
    }
}

