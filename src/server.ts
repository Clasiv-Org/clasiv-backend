import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const SHARED_DRIVE_ID = process.env.SHARED_DRIVE_ID;

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
	version: "v3",
	auth: oAuth2Client,
});

const listFiles = async (folderID: string|undefined) => {
	const fileRes = await drive.files.list({
		q: `'${folderID}' in parents and trashed = false`,
		fields: "files(id, name, mimeType)",
	});

    return fileRes.data.files;
}
app.get("/list-files", async (req: Request, res: Response) => {
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

app.get('/auth/google', (req: Request, res: Response) => {
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

		console.log("Access Token:", tokens.access_token);
		console.log("Refresh Token:", tokens.refresh_token);

		res.send("Login successful! Tokens received. Check logs.");
	} catch (error) {
		console.error("Error getting tokens:", error);
		res.status(500).send("Authentication failed");
	}
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
