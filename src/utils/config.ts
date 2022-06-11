import * as dotEnv from "dotenv"

dotEnv.config()

export default {
    PORT: Number(process.env.PORT) as number,
    JWT_SECRET: process.env.JWT_SECRET as string,
    APP_FRONTEND_URL: process.env.APP_FRONTEND_URL as string
}