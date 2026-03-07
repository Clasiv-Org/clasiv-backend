import { Request, Response, NextFunction } from 'express';

const otpValidator = (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: 'OTP is Required' });
    }
	if (otp.length !== 6) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    next();
}

export default otpValidator;
