import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import Token from "../utils/Token.js";

// Middleware
export const AuthGuard = async (req, _res, next) => {
    try {
        // Foydalanuvchi token yuborganmi, tekshiradi 
        const auth = req.headers?.authorization;
        if(!auth){
            throw new AppError("authorization error", 401);             // Agar token bo‘lmasa, 401 (Unauthorized) xatolik qaytaradi
        }

        // Authorization header "Bearer <token>" formatida yuborilganmi yoki yo‘qmi, shuni tekshirish.
        const bearer = auth.split(" ")[0];          // "Bearer"
        const authToken = auth.split(" ")[1];       // <token>

        if(bearer !== 'Bearer' && !authToken) {
            throw new AppError('unauthorized', 401)
        }

        const user = Token.verifyToken( authToken, config.TOKEN.ACCESS_KEY );

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}