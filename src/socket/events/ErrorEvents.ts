import { BroadcastOperator, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"





export const AppErrorEmitter = (socket: Socket|BroadcastOperator<DefaultEventsMap, any>, error: any) => {
    socket.emit("app_error", {
        success: false,
        name: error.name,
        message: error.message,
        errors: error.errors
    })
}