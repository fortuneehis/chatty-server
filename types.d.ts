declare namespace Express {
    export interface Request {
        user: {
            data: {
                id: number,
                username: string,
                profileImgUrl: string|null,
                authToken: string
            }
        }
        
    }
} 