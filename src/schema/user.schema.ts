import { object, string } from "yup";


export const createUserSchema = object().shape({
    body: object().shape({
        username: string().required("Username is required!").min(2).max(15),
        password: string().required("Password is required!").min(8),
        profileImgUrl: string()
    })
})

export const authenticateUserSchema = object().shape({
    body: object().shape({
        username: string().required("Username is required!"),
        password: string().required("Password is required!"),
    })
})

export const fetchUserSchema = object().shape({
    params: object().shape({
        id: string().required().matches(/\d+/)
    })
})
