import jwt from 'jsonwebtoken'
import config from '../config/index.js'

class Token {

    // JWT token (ya'ni maxsus kalitli raqamli belgilar toplami) yaratibberadi  
    generateAccessToken(payload) {
        return jwt.sign(payload, config.TOKEN.ACCESS_KEY, {     
            expiresIn: config.TOKEN.ACCESS_TIME                 // Token amal qilish muddati (masalan "1h", "7d")
        });
    }

    // Refresh Tokenni yaratish 
    generateRefreshToken(payload){
        return jwt.sign(payload, config.TOKEN.REFRESH_KEY, {
            expiresIn: config.TOKEN.REFRESH_TIME
        });
    }

    writeToCookie(res, key, value, expireDay) {
        res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            maxAge: Number(expireDay) * 24 * 60 * 60 * 1000
        });
    }

    verifyToken(token, secretKey) {
        return jwt.verify(token, secretKey);
    }
}

export default new Token();