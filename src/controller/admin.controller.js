import config from "../config/index.js";
import { UserRole } from "../const/UserRole.js";
import { AppError } from "../error/AppError.js";
import Admin from "../models/admin.model.js";
import Crypto from "../utils/Crypto.js";
import { successRes } from "../utils/successRes.js";
import { BaseController } from "./base.controller.js";
import Token from "../utils/Token.js";
import crypto from "crypto";
import sendEmail from "../utils/mail.js";
import cookieParser from "cookie-parser";


export class AdminController extends BaseController {
    constructor() {
        super(Admin);
        this.model = Admin;
    }

    async createAdmin(req, res, next) {
        try {
            const { username, email, password, phone_number, role, ...next } = req.body;

            // Username allaqachon mavjudmi tekshirish
            const existsUsername = await Admin.findOne({ username });
            if (existsUsername) {
                throw new AppError('Username already exists', 409);
            }

            // Email allaqachon mavjudmi tekshirish
            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                throw new AppError('Email already exists', 409);
            }

            // Phone_number allaqachon mavjudmi tekshirish
            const existsPhone_Number = await Admin.findOne({ phone_number })
            if (existsPhone_Number) {
                throw new AppError('Phone_number already exists', 409)
            }

            // Role kelganmi tekshirish
            if (!role) {
                throw new AppError('Role is required', 400)
            }

            // Role faqat "admin" yoki "superadmin" bo‘lishi kerak
            if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role)) {
                throw new AppError('Invalid role', 400)
            }

            // Password ni hash qilish
            const hashedPassword = await Crypto.encrypt(password);

            // Adminni yaratish
            const admin = await Admin.create({
                username,
                email,
                password: hashedPassword,
                phone_number,
                role,
                ...next
            });

            return successRes(res, admin, 201)

        } catch (error) {
            next(error);
        }
    }

    async signIn(req, res, next) {
        try {
            const { username = '', email = '', phone_number = '', password } = req.body;

            const admin = await Admin.findOne({
                $or: [
                    { username },
                    { email },
                    { phone_number }
                ]
            });

            if (!admin) {
                throw new AppError('Admin not found', 400);
            }

            const isMatchPassword = await Crypto.decrypt(password, admin.password);
            if (!isMatchPassword) {
                throw new AppError("Username, email or password incorrect", 400);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.is_active
            };

            const accessToken = Token.generateAccessToken(payload);
            const refreshToken = Token.generateRefreshToken(payload);

            Token.writeToCookie(res, 'refreshTokenAdmin', refreshToken, 30);

            return successRes(res, {
                token: accessToken,
                admin
            });

        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Authorization error', 401);
            }

            const verifyToken = Token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifyToken) {
                throw new AppError('Refresh Token expire', 401);
            }

            const admin = await Admin.findById(verifyToken?.id);
            if (!admin) {
                throw new AppError('Forbidden user', 403);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.is_active,
            }

            const accessToken = Token.generateAccessToken(payload);
            return successRes(res, {
                token: accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            let refreshToken = req.cookies?.refreshTokenAdmin;


            if (!refreshToken) {
                refreshToken = req.body?.refreshTokenAdmin;
            }

            if (!refreshToken) {
                throw new AppError("Refresh Token not found", 401);
            }

            const verifyToken = Token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifyToken) {
                throw new AppError("Refresh Token expire", 401);
            }

            const admin = await Admin.findById(verifyToken?.id);
            if (!admin) {
                throw new AppError("Forbidden user", 403);
            }

            res.clearCookie("refreshTokenAdmin"); 

            return successRes(res, { message: "Successfully signed out" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }


    async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body

            // Adminni email orqali topish 
            const admin = await Admin.findOne({ email });
            if (!admin) {
                throw new AppError('Email not found', 404);
            }

            // Reset token yaratish 
            const resetToken = crypto.randomBytes(32).toString("hex");

            // Adminga token va amal qilish muddatini berish 
            admin.resetPasswordToken = resetToken;
            admin.resetPasswordExpires = Date.now() + 3600 * 1000;
            await admin.save()

            const resetURL = `${config.CONFIRM_PASSWORD_URL}/${resetToken}`;

            // Otp jonatish 
            function generateSecureOTP() {
                const buffer = crypto.randomBytes(6);
                let otp = '';
                for (let i = 0; i < 6; i++) {
                    otp += (buffer[i] % 10).toString(); // 0–9 raqamlar
                }
                return otp;
            }

            const otp = generateSecureOTP();

            console.log("Your secure 6-digit OTP is:", otp);


            // Email yuborish 
            await sendEmail({
                to: admin.email,
                subject: 'Rest your password ',
                html: `<p>${otp} <a href="${resetURL}">here</a> to reset your password. Token is valid for 1 hour.</p>`,
            });

            admin.verfyOTP = otp
            await admin.save();


            console.log(`OTP: ${otp}`);
            return successRes(res, { message: "Rest link sent to email" });
        } catch (error) {
            next(error)
        }
    }

    async verifyPasswordOTP(req, res, next) {
        try {
            const { email, otp, password } = req.body

            const existsEmail = await Admin.findOne({ email })
            if (!existsEmail) {
                throw new AppError('Email not found', 400);
            }

            if (otp !== existsEmail.verfyOTP) {
                throw new AppError('Opt not found', 400)
            }

            // O'tipni ishlatgandan kegin o'chirish 
            existsEmail.verfyOTP = null;

            const hashedPassword = await Crypto.encrypt(password);
            existsEmail.password = hashedPassword;

            await existsEmail.save();

            return successRes(res, {
                message: `OTP to'g'ri \n Parolingiz yangilandi`
            });
        } catch (error) {
            next(error);
        }
    }


    async updateAdmin(req, res, next) {
        try {
            const id = req.params?.id;                                      // URL orqali yuborilgan admin ID ni olish
            const admin = await BaseController.checkById(Admin, id);                         // checkById funksiyasi ID orqali admin mavjudligini tekshiradi, agar yo'q bo'lsa xato chiqaradi

            const { username, email, password, phone_number, ...others } = req.body;    // request body dan yangilanishi mumkin bo'lgan maydonlarni olish

            if (username) {
                const exists = await Admin.findOne({ username })            // database da shu username mavjudligini tekshirish

                if (exists && exists._id.toString() !== id) {                // agar boshqa admin shu username bilan mavjud bo'lsa, xato chiqarish
                    throw new AppError('Username already exists', 409);
                }
            }

            if (email) {
                const exists = await Admin.findOne({ email })
                if (exists && exists._id.toString() !== id) {
                    throw new AppError('Email address already exists', 409);
                }
            }

            if (phone_number) {
                const exists = await Admin.findOne({ phone_number })
                if (exists && exists._id.toString() !== id) {
                    throw new AppError('Phone_number already exists', 409);
                }
            }

            let hashedPassword = admin.hashedPassword;                          // Passwordni yangilash

            // mavjud admin passwordini olish
            if (password) {
                if (req.user?.role !== UserRole.SUPERADMIN && req.user?._id.toString() !== id) {
                    throw new AppError('Not access to change password for admin', 403);
                }

                hashedPassword = await Crypto.encrypt(password);                        // yangi passwordni hash qilish

                delete req.body.password;                                               // plain text passwordni objectdan olib tashlash (xavfsizlik uchun)
            }

            // Adminni yangilash
            const updateAdmin = await Admin.findByIdAndUpdate(id, {
                ...req.body, hashedPassword                                 // yangilanishi kerak bo'lgan maydonlar + hashedPassword
            }, { new: true });                                              // yangilangan documentni qaytarish

            return successRes(res, updateAdmin)

        } catch (error) {
            next(error);
        }
    }

    async updatePasswordForAdmin(req, res, next) {
        try {
            const id = req.params?.id;
            const admin = BaseController.checkById(Admin, id)
            const { olPassword, newPassword } = req.body;
            const isMatchPassword = await Crypto.decrypt(olPassword, admin.hashedPassword);
            if (!isMatchPassword) {
                throw new AppError('Incorrect old password', 400);
            }

            const hashedPassword = await Crypto.encrypt(newPassword);
            const updateAdmin = await Admin.findByIdAndUpdate(id, { hashedPassword }, { new: true });
            return successRes(res, updateAdmin);
        } catch (error) {
            next(error);
        }
    }


}