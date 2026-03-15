import {Response, Request, NextFunction} from 'express';

const verificationValidator = (req: Request, res: Response, next: NextFunction) => {
    const { verification_type } = req.body;
    if (!verification_type) {
        return res.status(400).json({ message: 'Verification Type is Required' });
    }
	if (verification_type !== 'register' && verification_type !== 'login') {
        return res.status(400).json({ message: 'Invalid Verification Type' });
    }
    next();
}

export default verificationValidator;
