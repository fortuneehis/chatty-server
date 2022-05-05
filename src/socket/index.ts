import {Server} from 'socket.io'
import Connections from '../utils/connections'
import { newMessageListener } from './listeners/messageListeners'


const connections = new Connections<number, string>()

export default (io: Server)=> {

    io.on("connection", socket=>{
        newMessageListener(io, socket)
    })

}
