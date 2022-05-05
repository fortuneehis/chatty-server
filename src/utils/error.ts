


class CustomError extends Error {
    
    errors?: string[]
    status: number

    constructor(name: string, message: string, status: number, errors?: string[]) {
        super()
        this.name = name
        this.message = message
        this.errors = errors
        this.status = status
    }
}

export default CustomError