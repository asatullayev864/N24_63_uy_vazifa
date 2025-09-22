import Joi from 'joi';
import { UserRole } from '../const/UserRole.js';

class AdminValidation {
    static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    static phoneRegex = /^\+?[0-9]{10,15}$/;

    create() {
        return Joi.object({
            full_name: Joi.string().min(3).max(50).optional(),
            username: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(AdminValidation.passwordRegex).required(),
            phone_number: Joi.string().pattern(AdminValidation.phoneRegex).required(),
            role: Joi.string().valid(UserRole.ADMIN, UserRole.SUPERADMIN).required()
        })
    };

    signin() {
        return Joi.object({
            full_name: Joi.string().min(3).max(50).optional(),
            username: Joi.string().optional(),
            email: Joi.string().email().optional(),
            phone_number: Joi.string().pattern(AdminValidation.phoneRegex).optional(),
            password: Joi.string().pattern(AdminValidation.passwordRegex).required(),
        })
    }

    update(){
        return Joi.object({
            full_name: Joi.string().optional(),
            username: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().pattern(AdminValidation.passwordRegex).optional(),
            phone_number: Joi.string().pattern(AdminValidation.phoneRegex).optional(),
            role: Joi.string().default(UserRole.ADMIN).optional()
        });
    }

}


export default new AdminValidation();