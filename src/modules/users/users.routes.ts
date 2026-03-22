import { Router } from "express";
import * as userController from "@/modules/users/users.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import paginationValidator  from "@/middleware/pagination.middleware";
import { 
	CreateUserSchema, 
	UpdateUserSchema, 
    UpdateSelfSchema, 
} from "@/types/users";

const router = Router();

router.use(authentication);

router.post("/",
	validator(CreateUserSchema),
	userController.createUser
);
router.get("/", 
	paginationValidator,
	userController.getUsers
);
router.get("/me", 
	userController.getSelf
);
router.patch("/me", 
    validator(UpdateSelfSchema),
	userController.updateSelf
);
router.get("/:id", 
    userController.getUser
);
router.patch("/:id", 
    validator(UpdateUserSchema),
    userController.updateUser
);
router.delete("/:id", 
	userController.deleteUser
);

export default router;
