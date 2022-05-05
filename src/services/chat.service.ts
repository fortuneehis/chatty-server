
import prismaClient from "../db"
import CustomError from "../utils/error"

export const getChats = async(userId: number) => {
    try {
        const chats = await prismaClient.chat.findMany({
            include: {
                users: {
                    select: {
                        user: true,
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
            return chat.users.find(user=> user.user.id != userId)
        })

        return [filteredChat, null]
    } catch(err) {
        return [null, err]
    }
}

export const getChat = async(currentUserId: number, otherUserId: number) => {
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

        if(!chat) {
            const newChat = await prismaClient.chat.create({
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

            chat = newChat
        }
  
        return [chat, null]
    } catch(err: any) {
        return [null, err]
    }
}
