import multer from "multer"
import CustomError from "../utils/error"
import { Request } from "express"
import { storage } from "../utils/fileUpload"


const fileFilter = (acceptedMimetypes: string[]) => {
    return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if(acceptedMimetypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new CustomError("FileNotSupportedError", `This file is not supported! (accepted files must be a ${acceptedMimetypes.map(mimeType=> mimeType.split('/').join(','))})!`, 403))
        }
    }
}


const uploader = (filename: string, acceptedMimetypes: string[], ...filePath: string[]) => {
    return multer({
        storage: storage(filename, ...filePath),
        fileFilter: fileFilter(acceptedMimetypes)
    })
}

export default uploader


