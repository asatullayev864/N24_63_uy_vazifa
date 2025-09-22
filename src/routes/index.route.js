import { Router } from "express";
import adminRouter from './admin.route.js'
import { globalError } from "../error/globalError.js";

const router = Router();

router
    .use('/admin', adminRouter  )
    .use(globalError)

export default router;