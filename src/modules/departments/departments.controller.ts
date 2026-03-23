import { Request, Response } from "express";
import * as departmentService from "@/modules/departments/departments.service";

export const getDepartments = async (_req: Request, res: Response) => {
    try{
        const departments = await departmentService.getDepartments();
        res.json(departments);
    } catch(error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}
