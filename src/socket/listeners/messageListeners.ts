import { Server, Socket } from "socket.io";
import { newMessageSchema } from "../../schema/socket/message.schema";
import { chatService, messageService } from "../../services";
import connection from "../../utils/connections";
import dataValidator from "../../utils/dataValidator";
import { ChatEvents, ErrorEvents, messageEvents } from "../events";




const newMessageListener = (io: Server, socket: Socket) => {
    //@ts-ignore
    const user = socket.request.user
    socket.on("new_message", async(data, fn)=> {

        const [_, validationError ] = await dataValidator(newMessageSchema, data)


        if(validationError) {
            ErrorEvents.AppErrorEmitter(socket, validationError)
        }

        //first check if sender and receiver exists
        let [chat, chatError] = await chatService.chatExists(user.id, data.receiverId)

        if(chatError) {
            ErrorEvents.AppErrorEmitter(socket, chatError)
         }


         if(!chat) {
            const [newChat, newChatError] = await chatService.addChat(user.id, data.receiverId)

            if(newChatError) {
                ErrorEvents.AppErrorEmitter(socket, newChatError)
            }

            chat = {
                ...newChat
            }
            
        }

        let parentMessageId = null

        if(data.parentId) {
            const [parentMessage, parentMessageError] = await messageService.getMessage(data.parentId)

            if(parentMessageError) {
                ErrorEvents.AppErrorEmitter(socket, parentMessageError)
            }

            parentMessageId = parentMessage?.id
        }
        
      
        const [message, messageError] = await messageService.addMessage(chat.id as number,{
          message: data.message,
          isVoiceMessage: data.isVoiceMessage,
          voiceMessageAudioPath: data.voiceMessageAudioPath,
          senderId: user.id,
          parentId: parentMessageId
        })

        if(messageError) {
            return ErrorEvents.AppErrorEmitter(socket, messageError)
        }

        fn(message)

        await ChatEvents.recentChatEmitter(socket, chat.id, user.id)

        if(connection.exists(data.receiverId)) {
            await ChatEvents.recentChatEmitter(io.to(connection.find(data.receiverId) as string), chat.id, data.receiverId)
            if(io.to(connection.find(data.receiverId) as string).emit("new_message",message)) {
                await messageEvents.messageStatusEmitter(socket, message.id)      
            }
        }

    })

}



export default (io: Server, socket: Socket) => {
    newMessageListener(io, socket)
}