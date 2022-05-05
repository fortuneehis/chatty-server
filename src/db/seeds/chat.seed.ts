import { PrismaClient } from "@prisma/client"


export default async(prismaClient: PrismaClient) => {
    return await prismaClient.chatsUsers.createMany({
        data: [
            {
                userId: 1,
                chatId: 1
            }, 
            {
                userId: 3,
                chatId: 1
            }, 
            {
                userId: 4,
                chatId: 2
            },
            {
                userId:3,
                chatId: 2
            },
            {
                userId: 2,
                chatId: 3
            },
            {
                userId: 3,
                chatId: 3
            }
        ]
    })
}