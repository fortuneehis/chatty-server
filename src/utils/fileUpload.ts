import { randomUUID } from 'crypto'
import e from 'express'
import multer from 'multer'
import path from 'path'
import CustomError from './error'



const fileFilter = (acceptedMimetypes: string[]) => {
    return (req: e.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if(acceptedMimetypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new CustomError("FileNotSupportedError", `This file is not supported!(accepted files must be a ${acceptedMimetypes.map(mimeType=> mimeType.split('/').join(','))})!`, 403))
        }
    }
}

const storage = (filename: string, ...filePath: string[]) => {
    return multer.diskStorage({
        filename: (req, file, callback)=> {
            const ext = file.mimetype
     
            callback(null, filename)
        },
        destination: (req, file, callback)=> {
            callback(null, path.join(__dirname, ...filePath))
        }
    })
}





export const profileImageUploader = multer({
    storage: storage(`profile-${randomUUID()}-${Date.now()}`,"/uploads/profile"),
    fileFilter: fileFilter([
        "image/jpeg",
        "image/png"
    ])
})


export const voiceMessageUploader = multer({
    storage: storage(`voiceMessage-${randomUUID()}-${Date.now()}`, "/uploads/voice"),
    fileFilter: fileFilter([
        "audio/wav",
    ])
})


