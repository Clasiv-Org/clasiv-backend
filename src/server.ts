import "module-alias/register";
import express, { Request, Response } from "express";
import path from "path";
import usersRouter from "@/modules/users/users.routes";
import authRouter from "@/modules/auth/auth.routes";
import driveRouter from "@/modules/drive/drive.routes";
import rolesRouter from "@/modules/roles/roles.routes";
import departmentsRouter from "@/modules/departments/departments.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/drive", driveRouter);
app.use("/roles", rolesRouter);
app.use("/departments", departmentsRouter);
app.get("/health", (_req: Request, res: Response) => res.status(200).send("OK"));

app.use((_req, res) => {
	res.status(404).render("404", {
		title: "404 - Not Found",
		appName: "Clasiv",
		statusCode: 404,
		statusText: "Not Found",
		description: "Sorry, but the page you are looking for was not found."
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
