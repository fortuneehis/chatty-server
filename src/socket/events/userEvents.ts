import { Server, Socket } from "socket.io"




export const newMessageListener = (io: Server, socket: Socket) => {
    socket.emit("new_message")
}