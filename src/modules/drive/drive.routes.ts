import userAuth from "@/middleware/user.authentication";
import * as driveController from "@/modules/drive/drive.controller";
import { Router } from "express";

const router = Router();

router.use(userAuth);

router.get("/folders", driveController.getFolders);
router.get("/folders/:id", driveController.getFolder);

export default router;
