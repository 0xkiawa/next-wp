import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client with iDrive E2 configuration

const s3Config = {
  region: process.env.IDRIVE_E2_REGION,
  endpoint: process.env.IDRIVE_E2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.IDRIVE_E2_ACCESS_KEY_ID,
    secretAccessKey: process.env.IDRIVE_E2_SECRET_ACCESS_KEY
  },
  forcePathStyle: true // Important for some S3-compatible services
};

// Only initialize if we have credentials, otherwise null
const s3Client = (s3Config.credentials.accessKeyId && s3Config.credentials.secretAccessKey)
  ? new S3Client(s3Config)
  : null;

export { s3Client };

const BUCKET_NAME = process.env.IDRIVE_E2_BUCKET_NAME;

function checkS3Config() {
  if (!s3Client || !BUCKET_NAME) {
    throw new Error('S3 is not properly configured. Missing environment variables.');
  }
}

// Generate a presigned URL for uploading a file
export async function getPresignedUploadUrl(fileName, fileType, folder = 'uploads') {
  checkS3Config();
  // Create a unique file name to prevent overwriting
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `${folder}/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueFileName,
    ContentType: fileType
  });

  try {
    // Generate a presigned URL that expires in 15 minutes
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      presignedUrl,
      fileKey: uniqueFileName,
      fileUrl: `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${BUCKET_NAME}/${uniqueFileName}`
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

// Generate a presigned URL for downloading/viewing a file
export async function getPresignedDownloadUrl(fileKey) {
  checkS3Config();
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey
  });

  try {
    // Generate a presigned URL that expires in 1 hour
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
}

// Delete a file from S3
export async function deleteFileFromS3(fileKey) {
  checkS3Config();
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}