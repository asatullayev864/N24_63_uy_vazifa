import { createClient } from "redis";
import config from "../config/index.js";

const redisClient = createClient({
    socket: {
        host: config.REDIS.HOST,
        port: config.REDIS.PORT
    },
    password: config.REDIS.PASSWORD
});


redisClient.on('error', (err) => console.log('Error on connecting to radis', err));

await redisClient.connect();

export default redisClient;