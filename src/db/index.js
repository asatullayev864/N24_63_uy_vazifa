import { connect } from "mongoose";
import config from "../config/index.js";

export async function connectDB() {
    try {
        await connect(config.MONGO_URI);
        console.log('Database connected')
    } catch (error) {
        console.log('Error on connecting to database', error)
        process.exit(1);
    }
}