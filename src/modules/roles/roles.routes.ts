import { Router } from "express";
import * as roleController from "@/modules/roles/roles.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import { CreateRoleSchema } from "@/types/roles";

const router = Router();

router.use(authentication);

router.get("/", roleController.getRoles);
router.post("/", 
	validator(CreateRoleSchema),
	roleController.createRole
);

export default router;
