import {randomUUID} from "crypto"
import { Router } from "express";
import { userController } from "../controllers";
import { authMiddleware, fileUploader, requestValidator } from "../middlewares";
import { userSchema } from "../schema";


const userRouter = Router()

const profileImageUploader = fileUploader(`voiceMessage-${randomUUID()}-${Date.now()}`,
["image/jpeg, image/png"],
__dirname,"/uploads/voice").single('profileImage')

userRouter.post("/",
requestValidator(userSchema.createUserSchema),
userController.createUser)


userRouter.get("/",
authMiddleware,
userController.authenticatedUser)

userRouter.patch("/",
authMiddleware)

userRouter.post("/authenticate",
requestValidator(userSchema.authenticateUserSchema),
userController.authenticateUser)

userRouter.get("/search", 
requestValidator(userSchema.searchUsersSchema), 
authMiddleware, 
userController.searchUsers)

userRouter.post("/uploads/profile",
authMiddleware,
profileImageUploader,
userController.uploadProfileImage)

userRouter.post("/logout",
authMiddleware,
userController.logoutCurrentUser)

userRouter.get("/:id", 
requestValidator(userSchema.fetchUsersSchema),
authMiddleware, 
userController.fetchUser)




export default userRouter