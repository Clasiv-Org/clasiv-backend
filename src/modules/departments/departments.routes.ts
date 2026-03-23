import { Router } from "express";
import * as departmentController from "@/modules/departments/departments.controller";
import authentication from "@/middleware/global.authentication";

const router = Router();

router.use(authentication);

router.get("/", departmentController.getDepartments);

export default router;
