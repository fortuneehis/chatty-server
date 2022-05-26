
export default interface User {
    id: number
    username: string
    profileImgUrl: string|null
    password?: string
    status: string
    lastActiveAt: Date | null
}

 