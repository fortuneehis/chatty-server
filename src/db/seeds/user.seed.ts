import { PrismaClient } from "@prisma/client"


export default async(prismaClient: PrismaClient)=> {
    return await prismaClient.user.createMany({
        data: [
            {
                username: "tboy",
                password: "123",
                profileImgUrl: ""
            },
            {
                username: "akin",
                password: "1235",
                profileImgUrl: ""
            },
            {
                username: "john",
                password: "1238",
                profileImgUrl: ""
            },
            {
                username: "james",
                password: "1239",
                profileImgUrl: ""
            }
        ]
    })
}