import { NextFunction, Request, Response } from "express"
import { ObjectSchema, ValidationError } from "yup"
import dataValidator from "../utils/dataValidator"
import CustomError from "../utils/error"


const requestValidator = <T extends {}>(schema: ObjectSchema<T>) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        const [_, error] = await dataValidator(schema, req)

        if(error) {
            return next(error)
        }

        next()
    }
}

export default requestValidator
