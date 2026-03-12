import "module-alias/register";
import express, { Request, Response } from "express";
import usersRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SHARED_DRIVE_ID = process.env.SHARED_DRIVE_ID;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
	throw new Error("Missing required environment variables");
}

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
	version: "v3",
	auth: oAuth2Client,
});

const listFiles = async (folderID: string) => {
	if(!folderID){
        throw new Error("Folder ID is required");
    }

	const fileRes = await drive.files.list({
		q: `'${folderID}' in parents and trashed = false`,
		fields: "files(id, name, mimeType)",
	});

    return fileRes.data.files ?? [];
}

app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.get("/health", (_req: Request, res: Response) => res.status(200).send("OK"));
app.get("/list-files", async (_req: Request, res: Response) => {
	if(!SHARED_DRIVE_ID){
        throw new Error("Shared Drive ID is required");
	}

    try{
        const files = await listFiles(SHARED_DRIVE_ID);
        res.json(files);
	} catch (error: any) {
        console.error("Error getting files:", error);
        res.status(500).send("Error getting files");
	}
})
app.get("/list-files/:id", async (req: Request<{ id: string }>, res: Response) => {
	try{
		const files = await listFiles(req.params.id);
		res.json(files);
	} catch (error: any) {
        console.error("Error getting files:", error);
        res.status(500).send("Error getting files");
    }
});

app.get('/auth/google', (_req: Request, res: Response) => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/drive'],
		prompt: 'consent'
	});
	res.redirect(authUrl);
});

app.get('/oauth2callback', async (req: Request, res: Response) => {
	const code = req.query.code;

	if (!code || typeof code !== "string") {
		return res.status(400).send("Invalid or missing code");
	}

	try {
		const { tokens } = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(tokens);

		console.log("Tokens received:", tokens);
		res.send("Login successful! Tokens received. Check logs.");
	} catch (error) {
		console.error("Error getting tokens:", error);
		res.status(500).send("Authentication failed");
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
