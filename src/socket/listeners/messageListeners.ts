import { Server, Socket } from "socket.io";
import { newMessageSchema } from "../../schema/socket/message.schema";
import { chatService, messageService } from "../../services";
import connection from "../../utils/connections";
import dataValidator from "../../utils/dataValidator";
import { ChatEvents, ErrorEvents } from "../events";




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

            chat = newChat
            
        }

        
      
        const [message, messageError] = await messageService.addMessage(chat.id as number,{
          message: data.message,
          isVoiceMessage: data.isVoiceMessage,
          voiceMessageAudioPath: data.voiceMessageAudioPath,
          senderId: user.id
        })

        if(messageError) {
            return ErrorEvents.AppErrorEmitter(socket, messageError)
        }

        fn(message)

        const [chatData, chatDataError] = await chatService.getChat(chat.id, user.id) as [any, unknown]

        if(chatDataError) {
            return ErrorEvents.AppErrorEmitter(socket, chatDataError)
        }

        socket.emit("chats", chatData)

        if(connection.exists(data.receiverId)) {
            const [chatData, chatDataError] = await chatService.getChat(chat.id, data.receiverId) as [any, unknown]

            if(chatDataError) {
                return ErrorEvents.AppErrorEmitter(socket, chatDataError)
            }
            io.to(connection.find(data.receiverId) as string).emit("chats", chatData)
            if(io.to(connection.find(data.receiverId) as string).emit("new_message",message)) {
                //update message status to delivered
                const [messageStatus, messageStatusError] = await messageService.updateMessageStatus(message?.id as number, "DELIVERED")
                socket.emit(`message:${message?.id}`, messageStatus)
                
            }
        }

    })

}



export default (io: Server, socket: Socket) => {
    newMessageListener(io, socket)
}