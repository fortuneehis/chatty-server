import { BroadcastOperator, Server, Socket } from "socket.io";
import { ErrorEvents } from "./";
import { chatService } from "../../services";
import { DefaultEventsMap } from "socket.io/dist/typed-events";




export const recentChatEmitter = async(socket: Socket|BroadcastOperator<DefaultEventsMap, any>, chatId: number, userId: number) => {
    const [recentChat, recentChatError] = await chatService.getRecentChat(chatId, userId) as [any, unknown]

    if(recentChatError) {
        return ErrorEvents.AppErrorEmitter(socket, recentChatError)
    }

    socket.emit("chats", recentChat)
}
