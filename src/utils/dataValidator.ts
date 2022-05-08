import { ObjectSchema, ValidationError } from "yup";
import CustomError from "./error";




const dataValidator = async(schema: ObjectSchema<{}>, data: any) => {
    try {
        await schema.validate(data)
        return [true, null]
    } catch(err) {
        if(err instanceof ValidationError) {
            return [null, new CustomError(err.name, "", 401, err.errors)]
        }
        return [null, err]
    }
}

export default dataValidator

