import { BrevoClient }  from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CLASIV_EMAIL = process.env.CLASIV_EMAIL;

if(!BREVO_API_KEY || !CLASIV_EMAIL){
    throw new Error("BREVO_API_KEY is not defined");
}

const brevo = new BrevoClient({
    apiKey: BREVO_API_KEY
})

export const sendEmail = async (name: string, email: string, otp: string) => {
	const transacEmail = {
		sender: { 
			name: "Clasiv", 
			email: CLASIV_EMAIL 
		},
		to: [
			{ 
				name: name,
				email: email
			}
		],
		subject: "Comfirm your email for Clasiv",
		htmlContent: 
		`
		<div style="font-family: Arial, sans-serif; padding: 20px;">
			<h2 style="color: #333;">OTP Verification</h2>
			<p style="font-size: 16px;">
				Your OTP is:
			</p>
			<p style="
				font-size: 24px;
				font-weight: bold;
				color: #2d89ef;
				letter-spacing: 3px;
			">
                ${otp}
			</p>
			<p style="font-size: 12px; color: gray;">
				This code expires in 3 minutes.
			</p>
		</div>	
        `
	};
	try {
		await brevo.transactionalEmails.sendTransacEmail(transacEmail);
	} catch (error) {
        console.error("Error sending email:", error);
	}
}
