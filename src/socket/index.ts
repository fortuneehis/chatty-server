import {Server} from 'socket.io'
import { User } from '../dtos'
import config from '../utils/config'
import connection from '../utils/connections'
import CustomError from '../utils/error'
import { verifyJWT } from '../utils/user'
import listeners from './listeners'


export default (io: Server)=> {

    io.use((socket, next) => { 
         const authToken = socket.handshake?.auth?.token

         if(!authToken) {
             return next(new CustomError("TokenNotFoundError", "The auth token is missing!", 401))
         }
         
         const [user, error] = verifyJWT<User>(authToken, config.JWT_SECRET)

         if(error) {
            return next(error as Error)
        }

        //@ts-ignore
        socket.request.user = user
    })
   
    io.on("connection", socket=>{ 
        //@ts-ignore
        connection.add(socket.request.user.id, socket.id)
        listeners(io, socket)

        socket.on("disconnect", ()=> {
            //@ts-ignore
            if(connection.exists(socket.request.user.id)) {
                //@ts-ignore
                connection.remove(socket.request.user.id)
            }
            //create an active users event and fetch active users based on their Id and send to client
        })
    })


} 