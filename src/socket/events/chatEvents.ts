import { Server } from "socket.io";





export const chatMessageChageEvent = <T>(io: Server, chatId: number, payload: T) => {
    io.emit(`chats`, payload)
}