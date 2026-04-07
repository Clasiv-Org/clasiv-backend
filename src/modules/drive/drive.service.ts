import { 
	drive, 
	sharedDriveId
} from "@/config/google";

export const getFolder = async (folder_Id: string) => {
	if(!folder_Id) throw new Error("Folder ID is required");

	const fileRes = await drive.files.list({
		q: `'${folder_Id}' in parents and trashed = false`,
		fields: "files(id, name, mimeType)",
	});

    return fileRes.data.files ?? [];
}

export const getFolders = async () => {
	const fileRes = await drive.files.list({
		q: `'${sharedDriveId}' in parents and trashed = false`,
		fields: "files(id, name, mimeType)",
	});

    return fileRes.data.files ?? [];
}
