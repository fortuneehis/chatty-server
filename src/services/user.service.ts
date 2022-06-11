import prismaClient from "../db"
import CustomError from "../utils/error"
import config from "../utils/config"
import { User } from "../dtos"
import { comparePassword, generateJWT, hashPassword } from "../utils/user"
import { omit } from "lodash"


export const createUser = async ({username, password, profileImgUrl}: Pick<User, "username"|"password"|"profileImgUrl">): Promise<[boolean|null, unknown]> => {
    try {

        if(await usernameExists(username)) {
            throw new CustomError("DuplicateUsernameError", "Username already exists!", 403)
        }

        await prismaClient.user.create({
            data: {
                username: username,
                password: await hashPassword(password as string, 10),
                profileImgUrl: profileImgUrl || undefined
            }
        })

        return [true, null]
    } catch(err) {
        return [null, err]
    }
}

export const authenticateUser = async({username, password}: Pick<User, "username"|"password">): Promise<[Pick<User, "id"|"username"|"status"|"lastActiveAt"|"profileImgUrl">&{authToken: string}|null, unknown]> => {
    try {
        let user = await prismaClient.user.findUnique({
            select: {
                id: true,
                username: true,
                profileImgUrl: true, 
                status: true,
                lastActiveAt: true,
                password: true
            },
            where: {
              username
            }
        })
    
        if(!user || !await comparePassword(password as string, user.password)) {
            throw new CustomError("Invalid Credentials", "The username or password does not match our records!", 401)
        }


        const authToken = generateJWT({id: user.id}, config.JWT_SECRET ,{
            jwtOptions: {
                expiresIn: "7d"
            }
        })


        return [{...omit(user, ["password"]), authToken}, null]   

    } catch(err) {
        return [null, err]
    }
}


export const setUserStatus = async(userId: number, status: "ONLINE"|"OFFLINE", lastActivityDate?: boolean): Promise<[string|null, unknown]> => {

        try {
            const user = await prismaClient.user.update({
                select: {
                    status: true
                },
                where: {
                    id: userId
                },
                data: {
                    status,
                    ...(lastActivityDate && {lastActiveAt: new Date()})
                }
            })

            return [user.status, null]
        } catch(err: any) {
            return [null, err]
        }
     
}

export const fetchUsers = async(userIds: number[]): Promise<[Omit<User, "lastActiveAt"|"password">[]|null,unknown]> => {
    try {
        const users = await prismaClient.user.findMany({
            select: {
                id: true,
                username: true,
                profileImgUrl: true,
                status: true
            },
            where: {
                id: {
                    in: userIds
                }
            }
        })
    
        return [users, null]
    } catch(err: any) {
        return [null, err]
    }
    

}

export const fetchUser = async(id: number): Promise<[Pick<User, "id"|"username"|"profileImgUrl"|"status"|"lastActiveAt">|null, unknown]> => {
    try {
        const user = await prismaClient.user.findUnique({
            select: {
                id: true,
                username: true,
                profileImgUrl: true,
                status: true, 
                lastActiveAt: true
            },
            where: {
                id
            }
        })
        return [user, null]
    } catch(err) {
        return [null, err]
    }
}

export const searchUser = async(username: string, currentUserId: number) => {
    try {
        const user = await prismaClient.user.findMany({
            select: {
                id: true,
                username: true,
                profileImgUrl: true,
                status: true
            },
            where: {
                username: {
                    contains: username
                },
                AND: {
                    id: {
                        not: currentUserId
                    }
                }
            }
        })
        return [user, null]
    } catch(err) {
        return [null, err]
    }
}


const usernameExists = async (username: string): Promise<boolean> => {
   const exists = await prismaClient.user.findUnique({
       where: {
           username
       }
   })

   return !!exists
}



