import {
	brevo,
    clasivEmail,
    otpExpiryTime,
    year,
} from "@/config/brevo";
import { capitalizeWords } from "@/utils/string";

export const sendEmail = async (name: string, email: string, otp: string) => {
	const transacEmail = {
		sender: { 
			name: "Clasiv", 
			email: clasivEmail 
		},
		to: [{ 
				name: capitalizeWords(name),
				email: email
		}],
		subject: "Comfirm your email for Clasiv",
		htmlContent: 
		`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8" />
				<title>OTP Verification</title>
			</head>
			<body style="margin:0; padding:0; background-color:transparent; font-family:Arial, sans-serif;">
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td align="center" style="padding: 0;">

							<!-- Main Container -->
							<table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#E9E9E9; border-radius:10px; padding:30px 10px;">

								<!-- Header -->
								<tr>
									<td align="center" style="font-size:36px; font-weight:bold; color:#DC143C;">
										Clasiv
									</td>
								</tr>

								<tr><td height="20"></td></tr>

								<!-- Message -->
								<tr>
									<td style="font-size:14px; color:#555555; line-height:1.6;">
										Hi, ${capitalizeWords(name)}<br>
										Thank you for using our service.<br>
										Please use the following One-Time Password(OTP) to complete your verification:
									</td>
								</tr>

								<tr><td height="20"></td></tr>

								<!-- OTP Box -->
								<tr>
									<td align="center">
										<div style="
											display:inline-block;
											padding:15px 25px;
											font-size:24px;
											letter-spacing:4px;
											font-weight:bold;
											color:#DC143C;
											background: #D3D3D3;
											border-radius:6px;
											">
											${otp}
										</div>
									</td>
								</tr>

								<tr><td height="20"></td></tr>

								<!-- Expiry -->
								<tr>
									<td style="font-size:14px; color:#555555;">
										This OTP is valid for the next <strong>${otpExpiryTime} minutes</strong>.
									</td>
								</tr>

								<tr><td height="20"></td></tr>

								<!-- Warning -->
								<tr>
									<td style="font-size:13px; color:#888888; line-height:1.6;">
										For security reasons, do not share this code with anyone.<br>
										If you did not request this, you can safely ignore this email.
									</td>
								</tr>

								<tr><td height="30"></td></tr>

								<!-- Footer -->
								<tr>
									<td style="font-size:12px; color:#AAAAAA; text-align:center;">
										© ${year} Clasiv. All rights reserved.
									</td>
								</tr>

							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
        `
	};
	try {
		await brevo.transactionalEmails.sendTransacEmail(transacEmail);
	} catch (error) {
        console.error("Error sending email:", error);
	}
}
