import { google } from "googleapis";

const CLIENT_ID			= process.env.CLIENT_ID as string;
const CLIENT_SECRET		= process.env.CLIENT_SECRET as string;
const REDIRECT_URI		= process.env.REDIRECT_URI as string;
const REFRESH_TOKEN		= process.env.REFRESH_TOKEN as string;
const SHARED_DRIVE_ID	= process.env.SHARED_DRIVE_ID as string;

if (!CLIENT_ID)			throw new Error("Missing required environment variables");
if (!CLIENT_SECRET)		throw new Error("Missing required environment variables");
if (!REDIRECT_URI)		throw new Error("Missing required environment variables");
if (!REFRESH_TOKEN)		throw new Error("Missing required environment variables");
if (!SHARED_DRIVE_ID)	throw new Error("Shared Drive ID is required");

export const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({
	refresh_token: REFRESH_TOKEN
});

export const drive = google.drive({
	version: "v3",
	auth: oAuth2Client,
});

export const sharedDriveId = SHARED_DRIVE_ID;
