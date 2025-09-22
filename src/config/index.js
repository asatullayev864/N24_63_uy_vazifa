import { config } from "dotenv";
config();

export default {
    PORT: Number(process.env.PORT),
    MONGO_URI: String(process.env.MONGO_URI),

    SUPERADMIN: {
        USERNAME: String(process.env.SUPER_ADMIN_USERNAME),
        PASSWORD: String(process.env.SUPER_ADMIN_PASSWORD),
        EMAIL: String(process.env.SUPER_ADMIN_EMAIL),
        PHONE: String(process.env.SUPER_ADMIN_PHONE)
    },

    TOKEN: {
        ACCESS_KEY: String(process.env.ACCESS_KEY),
        ACCESS_TIME: process.env.ACCESS_TIME,      
        REFRESH_KEY: String(process.env.REFRESH_KEY),
        REFRESH_TIME: process.env.REFRESH_TIME     
    },


    MAIL: {
        HOST: String(process.env.MAIL_HOST),
        PORT: String(process.env.MAIL_PORT),
        USER: String(process.env.MAIL_USER),
        PASS: String(process.env.MAIL_PASS)
    },

    REDIS: {
        HOST: String(process.env.REDIS_HOST),
        PORT: Number(process.env.REDIS_PORT),
        PASSWORD: String(process.env.REDIS_PASSWORD)
    },
    CONFIRM_PASSWORD_URL: String(process.env.CONFIRM_PASSWORD_URL)
}