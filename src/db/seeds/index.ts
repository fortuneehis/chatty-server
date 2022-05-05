
const {PrismaClient} = require("@prisma/client")
const userSeed = require('./user.seed')
const messageSeed = require('./user.seed')
const chatSeed = require('./user.seed')
//to seed run npx prisma db seed

const prismaClient = new PrismaClient()


const seedDB = async () => {
    try {
        await Promise.all([
            userSeed(prismaClient),
            messageSeed(prismaClient),
            chatSeed(prismaClient)
        ])
    } catch(err) {
        console.log(err)
    } finally {
        prismaClient.$disconnect()
    }
}

seedDB()