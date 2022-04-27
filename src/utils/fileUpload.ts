import { randomUUID } from 'crypto'
import * as multer from 'multer'
import path from 'path'



const fileUploader = multer

fileUploader.diskStorage({
    filename: (req, file, callback)=> {
        const ext = file.mimetype
        const filename = `profile-${randomUUID()}-${Date.now()}`
        callback(null, filename)
    },
    destination: (req, file, callback)=> {
        callback(null, path.join(__dirname, '/uploads/profile'))
    }
})
