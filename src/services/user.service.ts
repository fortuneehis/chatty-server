import prismaClient from "../db"
import CustomError from "../utils/error"
import config from "../utils/config"
import { User } from "../dtos"
import { comparePassword, generateJWT, hashPassword } from "../utils/user"


export const createUser = async (user: Pick<User, "username"|"password"|"profileImgUrl">): Promise<[boolean|null, unknown]> => {
    try {

        if(await usernameExists(user.username)) {
            throw new CustomError("DuplicateUsernameError", "Username already exists!", 403)
        }

        await prismaClient.user.create({
            data: {
                username: user.username,
                password: await hashPassword(user.password, 10),
                profileImgUrl: user.profileImgUrl 
            }
        })

        return [true, null]
    } catch(err) {
        return [null, err]
    }
}

export const authenticateUser = async({username, password}: Pick<User, "username"|"password">): Promise<[string|null, unknown]> => {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
              username
            }
        })
    
        if(!user || !await comparePassword(password, user.password)) {
            throw new CustomError("Invalid Credentials", "The username or password does not match our records!", 401)
        }


        const authToken = generateJWT(user, config.JWT_SECRET ,{
            jwtOptions: {
                expiresIn: "7d"
            },
            omit: [
                "password",
                "createdAt",
                "updatedAt"
            ]
        })

        return [authToken, null]   

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

