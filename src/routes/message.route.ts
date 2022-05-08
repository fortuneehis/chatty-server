

//POST: upload voice message

import { randomUUID } from "crypto";
import { Router } from "express";
import { messageController } from "../controllers";
import { authMiddleware, fileUploader } from "../middlewares";

const messageRouter = Router()

const voiceMessageUploader = fileUploader(`voiceMessage-${randomUUID()}-${Date.now()}`, [
    "audio/wav"
] ,__dirname,"/uploads/voice").single("voiceMessage")


messageRouter.post("/upload/voice", 
authMiddleware, 
voiceMessageUploader,
messageController.uploadVoiceMessage)

export default messageRouter