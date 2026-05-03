import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/config/s3";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
if (!S3_BUCKET_NAME) throw new Error("Missing required env var: S3_BUCKET_NAME");


export const generateUploadPresignedUrl = async (key: string, fileSize: number) => {
	const command = new PutObjectCommand({
		Bucket: S3_BUCKET_NAME,
		Key: key,
		ContentType: "application/pdf",
        ContentLength: fileSize
	});

	const url = await getSignedUrl(s3(), 
		command, 
		{ expiresIn: 300 } // 5 minutes
	);
	return url;
};
