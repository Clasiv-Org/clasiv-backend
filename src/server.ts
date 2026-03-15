import "module-alias/register";
import express, { Request, Response } from "express";
import usersRouter from "@/modules/users/users.routes";
import authRouter from "@/modules/auth/auth.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.get("/health", (_req: Request, res: Response) => res.status(200).send("OK"));

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
