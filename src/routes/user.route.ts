//register user + upload profile pic
//login user
//UPDATE: upload user profile pic
//UPDATE: credentials

import { Router } from "express";
import { object, string } from "yup";
import { userController } from "../controllers";
import { authMiddleware, requestValidator } from "../middlewares";
import { userSchema } from "../schema";
import { profileImageUploader } from "../utils/fileUpload";



const userRouter = Router()


userRouter.post("/",
requestValidator(userSchema.createUserSchema),
userController.createUser)


userRouter.get("/",
authMiddleware)

userRouter.patch("/",
authMiddleware)

userRouter.post("/authenticate",
userController.authenticateUser
)

userRouter.post("/uploads/profile",
authMiddleware,
profileImageUploader.single('profileImage'),
userController.uploadProfileImage)

userRouter.post("/logout",
authMiddleware)

export default userRouter