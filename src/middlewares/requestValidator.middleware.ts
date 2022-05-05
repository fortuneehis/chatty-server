import { NextFunction, Request, Response } from "express"
import { ObjectSchema, ValidationError } from "yup"
import CustomError from "../utils/error"



const requestValidator = <T extends {}>(schema: ObjectSchema<T>) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req)
            next()
        } catch(err) {
            if(err instanceof ValidationError) {
                return next(new CustomError(err.name, "", 401, err.errors))
            }
            next(err)
        }
    }
}

export default requestValidator