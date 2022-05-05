import { Server, Socket } from "socket.io"




export const newMessageEmitter = <T={}>(io: Server, socket: Socket, payload:T) => {
    socket.emit("new_message")
}

