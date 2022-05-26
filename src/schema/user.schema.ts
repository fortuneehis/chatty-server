import { object, string } from "yup";


export const createUserSchema = object().shape({
    body: object().shape({
        username: string().required("Username is required!").min(2, "Username must be at least 2 characters").max(15, "Username must be at most 15 characters"),
        password: string().required("Password is required!").min(8, "Password must be at least 8 characters"),
        profileImgUrl: string()
    })
})

export const authenticateUserSchema = object().shape({
    body: object().shape({
        username: string().required("Username is required!"),
        password: string().required("Password is required!"),
    })
})

export const searchUsersSchema = object().shape({
    query: object().shape({
        username: string()
    })
})

export const fetchUsersSchema = object().shape({
    params: object().shape({
        id: string().required().matches(/\d+/) 
    })
})


