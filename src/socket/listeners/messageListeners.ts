import { Chat, Message } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { newMessageSchema } from "../../schema/socket/message.schema";
import { chatService, messageService } from "../../services";
import connection from "../../utils/connections";
import dataValidator from "../../utils/dataValidator";

let count: number = 0
const newMessageListener = (io: Server, socket: Socket) => {
    socket.on("new_message", async(data, fn)=> {

        const [_, error ] = await dataValidator(newMessageSchema, data)


        if(error) {
           return fn({
                success: false,
                ...error as Error
            })
        }

        //first check if sender and receiver exists
        const [chat, chatError] = await chatService.getChat(data.senderId, data.receiverId)

        if(chatError || !chat) {
            return fn({
                 success: false,
                 ...chatError as Error
             })
         }

        
      
        const [message, messageError] = await messageService.addMessage(chat.id,{
          message: data.message,
          isVoiceMessage: data.isVoiceMessage,
          voiceMessageAudioPath: data.voiceMessageAudioPath,
          senderId: data.senderId
        })

        if(messageError) {
            return fn({
                 success: false,
                 ...messageError as Error
             })
         }

        fn(message)

        if(connection.exists(data.receiverId)) {
            if(io.to(connection.find(data.receiverId) as string).emit("new_message",message)) {
                //update message status to delivered
            }
        }
    })

}






export default (io: Server, socket: Socket) => {
    newMessageListener(io, socket)
}