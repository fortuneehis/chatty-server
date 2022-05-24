

//fetch single chat

import { Router } from "express";
import { chatController } from "../controllers";
import { authMiddleware } from "../middlewares";

const chatRouter =  Router()


chatRouter.get("/", 
authMiddleware,
chatController.getChats)



export default chatRouter