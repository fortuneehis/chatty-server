export default interface Message {
    message: string
    senderId: number
    isVoiceMessage: boolean
    voiceMessageAudioPath: string|null
}