import { Server, Socket } from "socket.io";



export const newMessageListener = (io: Server, socket: Socket) => {
    socket.on("new_message", socket=> {

    })
}