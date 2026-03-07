import { Request, Response, NextFunction } from 'express';

const rollValidator = (req: Request, res: Response, next: NextFunction) => {
    const { roll_no } = req.body;
    if (!roll_no) {
        return res.status(400).json({ message: 'Roll No is required' });
    }
	if (roll_no.length !== 11) {
        return res.status(400).json({ message: 'Invalid Roll No' });
    }
    next();
}

export default rollValidator;
