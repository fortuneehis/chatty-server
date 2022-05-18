import { boolean, number, object, string } from "yup";



export const newMessageSchema = object().shape({
    receiverId: number().required(),
    message: string().nullable(),
    isVoiceMessage: boolean().default(false).nullable(),
    voiceMessageAudioPath: string().nullable()
})