import { NextFunction, Request, Response } from "express";



export const uploadVoiceMessage = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file
    const protocol = req.protocol
    const host = req.get("host")
    const filePath = `${protocol}:${host}/${file?.filename}`

    res.json({
        filePath
    })

}