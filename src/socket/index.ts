import {Server} from 'socket.io'
import { userService } from '../services'
import config from '../utils/config'
import connection from '../utils/connections'
import { verifyJWT } from '../utils/user'
import { ErrorEvents, userEvents } from './events'
import listeners from './listeners'


export default (io: Server)=> {

    io.use(async(socket, next)=>{

        const authToken = socket.handshake.auth?.token

        const [userId, jwtError] =  verifyJWT<{id: number}>(authToken as string, config.JWT_SECRET)

        if(jwtError) {
            return next(jwtError as Error)
        }

        const [user, userError] = await userService.fetchUser(userId?.id as number)

        if(userError) {
            return next(userError as Error)
        }
        

        //@ts-ignore
        socket.request.user = user

        next()
    }) 

    io.on("connection", async(socket)=>{ 

        //@ts-ignore
        const user = socket.request.user

        connection.add(user.id, socket.id)

        const [status, statusError] = await userService.setUserStatus(user.id, "ONLINE")

        if(statusError) {
            ErrorEvents.AppErrorEmitter(socket, statusError)
        }

        userEvents.userStatusEmitter(user.id, io, status)

        const [users, activeUsersError] = await userService.fetchUsers(connection.keys())

        if(activeUsersError) {
            ErrorEvents.AppErrorEmitter(socket, activeUsersError)
        }
    
        userEvents.activeUsersEmitter(socket, users)

        console.log("connected")
      

        listeners(io, socket)
    
        socket.on("disconnect", async()=> {
            console.log("disconnected!")

            if(connection.exists(user.id)) {

                connection.remove(user.id)

                const [status, statusError] = await userService.setUserStatus(user.id, "OFFLINE")

                if(statusError) {
                    ErrorEvents.AppErrorEmitter(socket, statusError)
                }

                userEvents.userStatusEmitter(user.id, io, status)

                const [users, activeUsersError] = await userService.fetchUsers(connection.keys())

                if(activeUsersError) {
                    ErrorEvents.AppErrorEmitter(socket, activeUsersError)
                }
                            
                userEvents.activeUsersEmitter(socket, users)

            }

        })
    })


} 