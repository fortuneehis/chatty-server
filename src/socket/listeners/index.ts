import { Server, Socket } from "socket.io"
import Connections from "../../utils/connections"
import messageListener from "./messageListeners"

export default (io: Server, socket: Socket)=> {
    messageListener(io, socket)
} 