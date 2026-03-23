import { Router } from "express";
import * as departmentController from "@/modules/departments/departments.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import { CreateDepartmentSchema } from "@/types/department";

const router = Router();

router.use(authentication);

router.get("/", departmentController.getDepartments);
router.post("/", 
	validator(CreateDepartmentSchema),
	departmentController.createDepartment
);

export default router;
