import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import {Server} from 'socket.io'
import { createServer } from 'http'
import socketServer from './socket'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { chatRouter, messageRouter, userRouter }from './routes'
import config from "./utils/config"
import path from 'path'

const app = express()
const httpServer = createServer(app)
const IOServer = new Server(httpServer, {
    cors: {
        credentials: true,
        origin: config.APP_FRONTEND_URL
    }
})
 
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(cors({
    credentials: true,
    origin: config.APP_FRONTEND_URL
}))

app.use("/uploads",express.static(path.join(__dirname, "/uploads")))


socketServer(IOServer)


app.use("/users", userRouter)
app.use("/chats", chatRouter)
app.use("/messages", messageRouter)




app.use("*",(req: Request, res: Response, next: NextFunction)=>{
    res.status(404).json({
        success: false,
        name: "RouteNotFoundError",
        message: "This route does not exist!"
    })
})

app.use((error: ErrorRequestHandler&{status: number, message: string, errors: string[] }, req: Request, res: Response, next: NextFunction)=>{
    res.status(error.status ?? 500).json({
        success: false,
        name: error.name,
        message: error.message,
        errors: error.errors
    })
})

httpServer.listen(config.PORT || 5000, ()=>{
    console.log("running...")
})