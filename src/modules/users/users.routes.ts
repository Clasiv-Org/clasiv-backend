import { Router } from "express";
import { getMe } from "./users.controller";
import { userAuth } from "../../middleware/user.auth";

const router = Router();

router.get("/me", userAuth, getMe);

export default router;
