const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Add console.log to debug credentials
console.log("AWS Config:", {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? "***exists***" : "missing",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      ? "***exists***"
      : "missing",
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1", // Add default region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file, key) => {
  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error("AWS_BUCKET_NAME is not defined");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("S3 Upload Error Details:", error);
    throw new Error(`Error uploading to S3: ${error.message}`);
  }
};
// https://keyurmotivationv.s3.ap-south-1.amazonaws.com/1738652185411-PM.png

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  console.log("params", params);

  try {
    const result = await s3Client.send(new DeleteObjectCommand(params));
    // console.log('File deleted from S3 successfully', result);
    return true;
  } catch (error) {
    throw new Error(`Error deleting from S3: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
