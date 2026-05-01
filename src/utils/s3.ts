import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3 } from "@/config/s3";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
if (!S3_BUCKET_NAME) throw new Error("Missing required env var: S3_BUCKET_NAME");


export const generateUploadPresignedUrl = async (key: string) => {
	const { url, fields } = await createPresignedPost(s3(), {
		Bucket: S3_BUCKET_NAME!,
		Key: key,
		Conditions: [
			["content-length-range", 1, 1 * 1024 * 1024], // 1 byte to 10MB
			["eq", "$Content-Type", "application/pdf"],
		],
		Fields: {
			"Content-Type": "application/pdf",
		},
		Expires: 180,
	});
	return { url, fields };
};
