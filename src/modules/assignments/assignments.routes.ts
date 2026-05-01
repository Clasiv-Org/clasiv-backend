import { Router } from "express";
import * as assignmentController from "@/modules/assignments/assignments.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import { 
    CreateAssignmentSchema
} from "@/types/assignments";

const router = Router();

router.use(authentication);

router.post("/", 
    validator(CreateAssignmentSchema),
    assignmentController.createAssignment
);
router.get("/", 
    assignmentController.getAssignments
);
router.get("/:id", 
    assignmentController.getAssignment
);

export default router;
