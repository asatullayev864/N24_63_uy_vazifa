import { Router } from "express";
import { AuthGuard } from "../guards/Auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import { validate } from "../middlewares/ValidateAdmin.js";
import AdminValidation from "../Validation/AdminValidation.js";
import { AdminController } from "../controller/admin.controller.js";
import { UserRole } from "../const/UserRole.js";
import { requestLimiter } from "../utils/request-limit.js";

const router = Router();
const controller = new AdminController();

router
    .post('/', AuthGuard, RolesGuard(UserRole.SUPERADMIN), validate(AdminValidation.create), controller.createAdmin)
    .post('/signin', requestLimiter(60,10), validate(AdminValidation.signin), controller.signIn)
    .post('/token', controller.generateNewToken)
    .post('/signout', AuthGuard, controller.signOut)    

    .get('/', AuthGuard, RolesGuard(UserRole.SUPERADMIN), controller.findAll)
    .get('/:id', AuthGuard, RolesGuard(UserRole.SUPERADMIN, "ID"), controller.findById)

    .post('/forget-password', validate(AdminValidation.requestPasswordReset), controller.requestPasswordReset)
    .post('/ConfirmOTP', validate(AdminValidation.verifyPasswordOTP),controller.verifyPasswordOTP)

    .patch('/updateAdmin/:id', AuthGuard, RolesGuard(UserRole.SUPERADMIN, "ID"), validate(AdminValidation.update), controller.updateAdmin)
    .patch('/updatePasswordForAdmin/:id', AuthGuard, RolesGuard(UserRole.SUPERADMIN, UserRole.ADMIN, "ID"), validate(AdminValidation.updatePasswordForAdmin), controller.updatePasswordForAdmin)
    
    .delete('/:id', AuthGuard, RolesGuard(UserRole.SUPERADMIN, "ID"), controller.delete )
export default router;