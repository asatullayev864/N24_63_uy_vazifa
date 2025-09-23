
import { model, Schema } from "mongoose";
import { UserRole } from "../const/UserRole.js";

const AdminSchema = new Schema(

    {
        full_name: { type: String, required: false },
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        phone_number: { type: String, unique: true, required: true },
        is_active: { type: Boolean, default: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.ADMIN },
        verfyOTP: { type: Number,min: 100000, max: 999999, required: false } 
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Admin = model('Admin', AdminSchema);

export default Admin;