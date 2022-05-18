import { Socket } from "socket.io"





export const AppErrorEmitter = (socket: Socket, error: any) => {
    socket.emit("app_error", {
        success: false,
        name: error.name,
        message: error.message,
        errors: error.errors
    })
}