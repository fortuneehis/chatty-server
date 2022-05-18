
import { Server, Socket } from "socket.io";
import connection from "../../utils/connections";



const userOnlineListener = (io: Server, socket: Socket) => {

}






export default (io: Server, socket: Socket) => {
    userOnlineListener(io, socket)
}