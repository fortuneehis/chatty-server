import { PrismaClient } from "@prisma/client"

export default async(prismaClient: PrismaClient) => {
    return await prismaClient.message.createMany({
        data: [
            {
                message: "hi",
                senderId: 4,
                chatId: 1
            },
            {
                message: "u good?",
                senderId: 3,
                chatId: 1
            }
        ]
    })
}