export default interface Message {
    id: number
    parentId?: number|null
    message: string
    senderId: number
    isVoiceMessage: boolean
    voiceMessageAudioPath: string|null
}