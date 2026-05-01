import { Router } from "express";
import * as assignmentController from "@/modules/assignments/assignments.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import { GetAssignmentPayloadSchema } from "@/types/assignments";

const router = Router();

router.use(authentication);

router.get("/", 
    assignmentController.getAssignments
);

router.get("/:id", 
    validator(GetAssignmentPayloadSchema),
    assignmentController.getAssignment
);

export default router;
