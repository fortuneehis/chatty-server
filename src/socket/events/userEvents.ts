import { Server, Socket } from "socket.io"





export const userStatusEmitter = <T = {}>(userId: number, io: Server, payload: T) => {
    io.emit(`user_status:${userId}`, payload)
}

export const activeUsersEmitter = <T = []>(socket: Socket, payload: T) => {
    socket.emit("active_users", payload)
}