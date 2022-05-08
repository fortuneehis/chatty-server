import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { omit, PropertyName } from "lodash"
import CustomError from "./error"

type options = {
    omit: PropertyName[],
    jwtOptions?: jwt.SignOptions
}

export const hashPassword = async (password: string, rounds?: number) => {
    const salt = await bcrypt.genSalt(rounds)
    return await bcrypt.hash(password, salt)
}


export const comparePassword = async(string:string, hash: string) => {
    return await bcrypt.compare(string, hash)
}


export const generateJWT = <T extends {}>(payload:T,secret: string, options: options) => {
     const token = jwt.sign(omit(payload, options.omit),secret,options.jwtOptions)

    return token
}

export const verifyJWT = <T>(token: string, secret: string): [T|null, unknown|null] => {
    try {
        const payload = jwt.verify(token, secret)
        return [payload as T, null]
    } catch(err) {
        if(err instanceof jwt.JsonWebTokenError) {
            return [null, new CustomError(err.name, "Invalid token", 401)]
        }
        if(err instanceof jwt.TokenExpiredError) {
            return [null, new CustomError(err.name, "This token has expired!", 401)]
        }
        return [null, err]
    }
}