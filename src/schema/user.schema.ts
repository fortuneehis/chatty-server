import { object, string } from "yup";


export const createUserSchema = object().shape({
    body: object().shape({
        username: string().required("Username is required!"),
        password: string().required("Password is required!")
    })
})

