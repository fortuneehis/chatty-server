declare namespace Express {
    export interface Request {
        user: {
            data: {
                id: number,
                username: string,
                profileImgUrl?: string,
                authToken: string
            }
        }
        
    }
} 