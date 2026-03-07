import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

const emailValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is Required' });
    }
	if(!validator.isEmail(email)){
        return res.status(400).json({ message: 'Invalid Email' });
    }
    next();
}

export default emailValidator;
