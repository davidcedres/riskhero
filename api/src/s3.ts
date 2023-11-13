import 'dotenv/config'

import { S3 } from '@aws-sdk/client-s3'
import { Client as MinioClient } from 'minio'
import multer from 'multer'
import multerS3 from 'multer-s3'

export const s3 = new S3({
    endpoint: 'https://files.riskninja.io',
    forcePathStyle: true,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY!
    }
})

export const minioClient = new MinioClient({
    endPoint: 'files.riskninja.io',
    port: 443,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY_ID!,
    secretKey: process.env.MINIO_SECRET_ACCESS_KEY!
})

const storage = multerS3({
    s3,
    bucket: 'evidences',
    acl: 'public-read',
    key: function (req, file, cb) {
        // TODO: let's pray it never collides
        // gnBvowf_ViV4inQGFl0Cn.jpg
        cb(null, file.originalname)
    }
})

export const fileUpload = multer({ storage })
