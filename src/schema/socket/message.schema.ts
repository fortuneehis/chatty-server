import { boolean, number, object, string } from "yup";



export const newMessageSchema = object().shape({
    senderId: number().required(),
    receiverId: number().required(),
    message: string().nullable(),
    isVoiceMessage: boolean().default(false).nullable(),
    voiceMessageAudioPath: string().nullable()
})