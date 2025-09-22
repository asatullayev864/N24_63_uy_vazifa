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

    .patch('/password/:id', AuthGuard, RolesGuard(UserRole.SUPERADMIN, "ID"), validate(AdminValidation.update), controller.updateAdmin)
    

export default router;