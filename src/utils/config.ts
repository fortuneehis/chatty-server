import * as dotEnv from "dotenv"

dotEnv.config()

export default {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET as string
}