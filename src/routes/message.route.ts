

//POST: upload voice message

import { Router } from "express";
import { messageController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { voiceMessageUploader } from "../utils/fileUpload";


const messageRouter = Router()

messageRouter.post("/upload/voice", 
// authMiddleware, 
voiceMessageUploader.single("voiceMessage"),
messageController.uploadVoiceMessage)

export default messageRouter