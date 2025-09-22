import { AppError } from "../error/AppError.js"

export const RolesGuard = (...roles) => {
    return function(req, _res, next) {
        try {
            if(( req.user?.role && roles.includes(req.user.role)) || (roles.includes("ID") && req.user?.id === req.params.id)){
                return next()
            }

            throw new AppError('forbidden user', 403);
        } catch (error) {
            next(error)
        }
    }
}