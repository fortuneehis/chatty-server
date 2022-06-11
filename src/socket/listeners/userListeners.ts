
import { Server, Socket } from "socket.io";
import connection from "../../utils/connections";



const userOnlineListener = (io: Server, socket: Socket) => {

}

const userTypingListener = (io: Server, socket: Socket) => {

    // socket.on("user_typing", (userId: number)=>{
    //     if(connection.exists(userId)) {
    //         socket.broadcast.to(connection.find(userId) as string).emit("")
    //     }  
        
    // })
    
}





export default (io: Server, socket: Socket) => {
    userOnlineListener(io, socket)
}