import { Server, Socket } from "socket.io";
import { chatService } from "../../services";



export const newMessageListener = (io: Server, socket: Socket) => {
    return socket.on("new_message", async (data)=> {
        const [chat, error] = await chatService.getChat(4,2)

      /*
      chat, message, sender, 
      */
    })
}