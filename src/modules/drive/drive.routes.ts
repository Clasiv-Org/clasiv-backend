import { Router } from "express";
import * as driveController from "@/modules/drive/drive.controller";
import authentication from "@/middleware/global.authentication";

const router = Router();

router.use(authentication);

router.get("/folders", driveController.getFolders);
router.get("/folders/:id", driveController.getFolder);

export default router;
