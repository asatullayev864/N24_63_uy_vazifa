import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import { connectDB } from "./db/index.js";
import router from "./routes/index.route.js";
import { globalError } from "./error/globalError.js";
import { join } from "path";

export async function application(app) {

    // CORS middleware
    app.use(cors({ origin: '*' }));

    // HTTP header security
    app.use(helmet());

    // JSON body parsing
    app.use(express.json());

    // Cookie parsing
    app.use(cookieParser());


    app.use('/api/uploads', express.static(join(process.cwd(), '../uploads')))

    // DB ga ulanish
    await connectDB();

    // Routerlarni ulash
    app.use('/api', router);

    app.use(globalError);
}
