import { AppError } from "../error/AppError.js";

export const validate = (schemaValid) => {
    return function(req, _res, next) {
        try {
            
            // Joi schema funksiyasini chaqirib olamiz
            const schema = schemaValid()
            
            // Request body ma'lumotlarini schema bilan tekshirish
            const { error } = schema.validate(req.body);
            
            // Agar xato bo‘lsa, AppError orqali 422 xato qaytarish
            if(error){
                throw new AppError(error?.details[0]?.message ?? 'Error input validation', 422);
            }
            
            // Agar hammasi to‘g‘ri bo‘lsa, keyingi middleware yoki controllerga o‘tish
            next();
        } catch (error) {
            next(error)
        }
    }
}