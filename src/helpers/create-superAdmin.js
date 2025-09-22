import { disconnect } from "mongoose";
import config from "../config/index.js";
import { connectDB } from "../db/index.js";
import Admin from "../models/admin.model.js";
import Crypto from "../utils/Crypto.js";
import { UserRole } from "../const/UserRole.js";

(async function () {

    try {
        await connectDB();
        const hashedPassword = await Crypto.encrypt(config.SUPERADMIN.PASSWORD)

        await Admin.create({
            full_name: 'Javohir Quromboyev', 
            username: config.SUPERADMIN.USERNAME,
            email: config.SUPERADMIN.EMAIL,
            phone_number: config.SUPERADMIN.PHONE,  
            password: hashedPassword,
            role: UserRole.SUPERADMIN
        });



        console.log('Super admin success created');
        await disconnect();
    } catch (error) {
        console.log('Error on createing super admin', error);
    }
}());
