export default interface Message {
    id: number
    message: string
    senderId: number
    isVoiceMessage: boolean
    voiceMessageAudioPath: string|null
}