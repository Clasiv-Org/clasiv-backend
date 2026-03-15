import { Router } from "express";
import * as userController from "@/modules/users/users.controller";
import { userAuth } from "@/middleware/user.middleware";
import paginationValidator  from "@/middleware/pagination.middleware";

const router = Router();

router.use(userAuth);

router.get("/", 
	paginationValidator,
	userController.getUsers
);
router.get("/me", userController.getMe);

export default router;
