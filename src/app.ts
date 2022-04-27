import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import {Server} from 'socket.io'
import { createServer } from 'http'
import socketServer from './socket'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const IOServer = new Server(httpServer)


app.use(helmet)
app.use(cors)
app.use(compression)


socketServer(IOServer)



app.use("*",(req: Request, res: Response, next: NextFunction)=>{
    //404 error handling
})

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction)=>{
    //global error handling here
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log("running...")
})