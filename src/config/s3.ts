import { S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET_API_ENDPOINT	= process.env.S3_BUCKET_API_ENDPOINT;
const S3_BUCKET_KEY_ID			= process.env.S3_BUCKET_KEY_ID;
const S3_BUCKET_API_KEY			= process.env.S3_BUCKET_API_KEY;
const S3_BUCKET_REGION			= process.env.S3_BUCKET_REGION;

if (!S3_BUCKET_API_ENDPOINT)	throw new Error("Missing required env var: S3_BUCKET_API_ENDPOINT");
if (!S3_BUCKET_KEY_ID)			throw new Error("Missing required env var: S3_BUCKET_KEY_ID");
if (!S3_BUCKET_API_KEY)			throw new Error("Missing required env var: S3_BUCKET_API_KEY");
if (!S3_BUCKET_REGION)			throw new Error("Missing required env var: S3_BUCKET_REGION");

export const s3 = () => {
	return new S3Client({
		endpoint: S3_BUCKET_API_ENDPOINT,
		credentials: {
			accessKeyId: S3_BUCKET_KEY_ID,
			secretAccessKey: S3_BUCKET_API_KEY,
		},
		region: S3_BUCKET_REGION,
	});
}
