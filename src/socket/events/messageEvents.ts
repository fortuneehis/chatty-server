import { Server, Socket } from "socket.io"
import { ErrorEvents } from "./"
import { messageService } from "../../services"


export const newMessageEmitter = <T={}>(io: Server, socket: Socket, payload:T) => {
    socket.emit("new_message", payload)
}


export const messageStatusEmitter = async(socket: Socket, messageId: number) => {
    //update message status to delivered
    const [messageStatus, messageStatusError] = await messageService.updateMessageStatus(messageId as number, "DELIVERED")
                
    if(messageStatusError) {
        return ErrorEvents.AppErrorEmitter(socket, messageStatusError)
    
    }
    socket.emit(`message:${messageId}`, messageStatus)
}
