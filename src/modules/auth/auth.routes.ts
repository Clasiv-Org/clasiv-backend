import { Router } from "express";
import validator from "@/middleware/global.validator";
import refreshAuthentication from "@/middleware/refresh.authentication";
import * as authController from "@/modules/auth/auth.controller";
import { 
	ActivationInitiateSchema, 
    ActivationCompleteSchema, 
    ActivationOtpSendSchema,
    ActivationOtpVerifySchema,
    ActivationOtpResendSchema,
    ActivationOtpChangeEmailSchema,
	LoginSchema, 
} from "@/types/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & account activation
 */

/**
 * @swagger
 * /auth/activation/initiate:
 *   post:
 *     tags: [Auth]
 *     summary: Initiate account activation
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               userName:
 *                 type: string
 *                 example: user_1234
 *               password:
 *                 type: string
 *                 example: password1234
 *     responses:
 *       200:
 *         description: Activation session has been initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activation session initiated
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 activationSessionId:
 *                   type: string
 *                   example: 12345678-1234-1234-1234-123456789012
 *                 user:
 *                   $ref: '#/components/schemas/UserSafe'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Invalid password
 *               statusCode: 401
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User not found
 *               statusCode: 404
 *       409:
 *         description: User is already activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User is already activated
 *               statusCode: 409
 *       500:
 *         description: |
 *           Internal server error, Possible causes:
 *           - User has no password set
 *           - Failed to create Activation Session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             examples:
 *               no_password:
 *                 value:
 *                   message: User has no password set
 *                   statusCode: 500
 *               creation_error:
 *                 value:
 *                   message: Failed to create Activation Session
 *                   statusCode: 500
 */

router.post("/activation/initiate", 
	validator(ActivationInitiateSchema),
	authController.activationInitiate
);

/**
 * @swagger
 * /auth/activation/otp:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP to Email Address
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               activationSessionId:
 *                 type: string
 *                 example: 12345678-1234-1234-1234-123456789012
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP sent to the designated Email Address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       404:
 *         description: The activation session does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Activation Session not found
 *               statusCode: 404
 *       500:
 *         description: Failed to create OTP Session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Failed to create OTP Session
 *               statusCode: 500
 */
router.post("/activation/otp", 
    validator(ActivationOtpSendSchema),
    authController.activationOtpSend
);

/**
 * @swagger
 * /auth/activation/otp/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify the OTP sent to the Email Address
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               activationSessionId:
 *                 type: string
 *                 example: 12345678-1234-1234-1234-123456789012
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email has been successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       401:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Invalid OTP
 *               statusCode: 401
 *       404:
 *         description: Activation Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Activation Session not found
 *               statusCode: 404
 *       409:
 *         description: OTP already used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP already used
 *               statusCode: 409
 *       410:
 *         description: OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP expired
 *               statusCode: 410
 *       429:
 *         description: OTP attempt limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP attempt limit exceeded
 *               statusCode: 429
 *       500:
 *         description: OTP Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP Session not found
 *               statusCode: 500
 */
router.post("/activation/otp/verify", 
    validator(ActivationOtpVerifySchema),
    authController.activationOtpVerify
);

/**
 * @swagger
 * /auth/activation/otp/resend:
 *   post:
 *     tags: [Auth]
 *     summary: Request a new OTP to be resent
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               activationSessionId:
 *                 type: string
 *                 example: 12345678-1234-1234-1234-123456789012
 *     responses:
 *       200:
 *         description: New OTP has been successfully resent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       404:
 *         description: Activation Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Activation Session not found
 *               statusCode: 404
 *       409:
 *         description: OTP already used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP already used
 *               statusCode: 409
 *       410:
 *         description: OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP expired
 *               statusCode: 410
 *       429:
 *         description: OTP resend limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP resend limit exceeded
 *               statusCode: 429
 *       500:
 *         description: OTP Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP Session not found
 *               statusCode: 500
 */
router.post("/activation/otp/resend", 
    validator(ActivationOtpResendSchema),
    authController.activationOtpResend
);

/**
 * @swagger
 * /auth/activation/otp/change-email:
 *   post:
 *     tags: [Auth]
 *     summary: Change the previously designated Email Address
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               activationSessionId:
 *                 type: string
 *                 example: 12345678-1234-1234-1234-123456789012
 *               newEmailId:
 *                 type: string
 *                 format: email
 *                 example: john@example.new.com
 *     responses:
 *       200:
 *         description: New OTP has been successfully sent to the new Email Address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to new email!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       404:
 *         description: Activation Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Activation Session not found
 *               statusCode: 404
 *       409:
 *         description: OTP already used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP already used
 *               statusCode: 409
 *       410:
 *         description: OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP expired
 *               statusCode: 410
 *       429:
 *         description: Email change limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Email change limit exceeded
 *               statusCode: 429
 *       500:
 *         description: OTP Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: OTP Session not found
 *               statusCode: 500
 */
router.post("/activation/otp/change-email", 
    validator(ActivationOtpChangeEmailSchema),
    authController.activationOtpChangeEmail
);

/**
 * @swagger
 * /auth/activation/complete:
 *   post:
 *     tags: [Auth]
 *     summary: Complete account activation
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [activationSessionId, emailId, password]
 *             properties:
 *               activationSessionId:
 *                 type: string
 *                 example: 12345678-1234-1234-1234-123456789012
 *               userName:
 *                 type: string
 *                 nullable: true
 *                 example: user_1234
 *               phoneNo:
 *                 type: string
 *                 nullable: true
 *                 example: 1234567890
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: 12345678pass
 *     responses:
 *       200:
 *         description: Account has been successfully Activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account activated successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 tokens:
 *                   $ref: '#/components/schemas/Token'
 *                 user:
 *                   $ref: '#/components/schemas/UserProfileSafe'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       403:
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Email not verified
 *               statusCode: 403
 *       404:
 *         description: Activation Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Activation Session not found
 *               statusCode: 404
 *       500:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User not found
 *               statusCode: 500
 */
router.post("/activation/complete", 
    validator(ActivationCompleteSchema),
    authController.activationComplete
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with username or email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               userName:
 *                 type: string
 *                 nullable: true
 *                 description: Required if emailId is null
 *                 example: user_1234
 *               emailId:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 description: Required if userName is null
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: 12345678pass
 *     responses:
 *       200:
 *         description: Account has been successfully Logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 tokens:
 *                   $ref: '#/components/schemas/Token'
 *                 user:
 *                   $ref: '#/components/schemas/UserProfileSafe'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Validation error
 *               statusCode: 400
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: Invalid password
 *               statusCode: 401
 *       403:
 *         description: User is not activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User is not activated
 *               statusCode: 403
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User not found
 *               statusCode: 404
 *       500:
 *         description: User has no password set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: User has no password set
 *               statusCode: 500
 */
router.post("/login", 
    validator(LoginSchema),
	authController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotate refresh token and return new access token
 *     security: []
 *     parameters:
 *       - in: header
 *         name: X-Client-Type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mobile, web]
 *         description: Client type — determines where refresh token is read from
 *       - in: header
 *         name: X-Refresh-Token
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when X-Client-Type is mobile
 *       - in: cookie
 *         name: refresh_token
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when X-Client-Type is web
 *     responses:
 *       200:
 *         description: Tokens rotated successfully
 *         headers:
 *           Set-Cookie:
 *             description: New refresh token cookie (web only)
 *             schema:
 *               type: string
 *               example: refresh_token=eyJ...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tokens refreshed successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 refreshToken:
 *                   type: string
 *                   description: Mobile only — not returned for web
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 user:
 *                   $ref: '#/components/schemas/UserProfileSafe'
 *       401:
 *         description: Invalid, expired, revoked or reused refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_refresh_token:
 *                 value:
 *                   message: No refresh token
 *                   statusCode: 401
 *                   errorCode: NO_REFRESH_TOKEN
 *               invalid_token:
 *                 value:
 *                   message: Invalid refresh token
 *                   statusCode: 401
 *                   errorCode: INVALID_TOKEN
 *               token_expired:
 *                 value:
 *                   message: Token expired
 *                   statusCode: 401
 *                   errorCode: TOKEN_EXPIRED
 *               token_revoked:
 *                 value:
 *                   message: Refresh token revoked
 *                   statusCode: 401
 *                   errorCode: TOKEN_REVOKED
 *               token_reuse:
 *                 value:
 *                   message: Token reuse detected
 *                   statusCode: 401
 *                   errorCode: TOKEN_REUSE_DETECTED
 *       404:
 *         description: Refresh token session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Refresh token session not found
 *               statusCode: 404
 *               errorCode: TOKEN_NOT_FOUND
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Something went wrong
 *               statusCode: 500
 *               errorCode: INTERNAL_ERROR
 */
router.post("/refresh", 
	refreshAuthentication,
	authController.refreshTokens
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout the current session
 *     parameters:
 *       - in: header
 *         name: X-Client-Type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mobile, web]
 *         description: Client type — determines where refresh token is read from
 *       - in: header
 *         name: X-Refresh-Token
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when X-Client-Type is mobile
 *       - in: cookie
 *         name: refresh_token
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when X-Client-Type is web
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Invalid, expired or revoked refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to revoke refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/logout", 
    refreshAuthentication,
	authController.logout
);

export default router;
