import multer from 'multer'
import path from 'path'

export const storage = (filename: string, ...filePath: string[]) => {
    return multer.diskStorage({
        filename: (req, file, callback)=> {
            const ext = file.mimetype
     
            callback(null, filename)
        },
        destination: (req, file, callback)=> {
            callback(null, path.join(...filePath))
        }
    })
}


