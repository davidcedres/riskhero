import "dotenv/config";
import { S3 } from "@aws-sdk/client-s3";

export const s3 = new S3({
    endpoint: "https://files.riskninja.io",
    forcePathStyle: true,
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY!,
    },
});
