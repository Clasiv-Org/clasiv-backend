import { Request, Response } from "express";
import * as driveService from "./drive.service";

export const getFolders = async (req: Request, res: Response) => {
    try{
        const files = await driveService.getFolders();
        res.json(files);
	} catch(error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
	}
}
export const getFolder = async (req: Request<{ id: string }>, res: Response) => {
    try{
        const files = await driveService.getFolder(req.params.id);
        res.json(files);
	} catch(error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
	}
}
