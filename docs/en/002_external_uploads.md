## External uploads

### Background

The `UppyS3Field` allows direct to S3 uploads via a presigned link (see `S3_UPLOAD_EXPIRY_MINUTES` below).

When an upload occurs on the field, it will be submitted directly to the URL provided as the presigned link for the upload.

Once the upload is complete, the field will call a notify endpoint on the field URL with information about the successful upload. An `ExternalUpload` record will be written.

### Configuration

To configure the UppyS3Field:

```dotenv
# An AWS region
S3_UPLOAD_AWS_S3_REGION="your-aws-region"
# AWS API version
S3_UPLOAD_AWS_API_VERSION="latest"
S3_UPLOAD_AWS_ACCESS_KEY_ID="----"
S3_UPLOAD_AWS_SECRET_ACCESS_KEY="----"
S3_UPLOAD_AWS_S3_BUCKET="your.s3.bucket.name"
# Flip to anything not "false" to set debug on the S3Client
S3_UPLOAD_AWS_DEBUG="false"
# Presigned request URL expiry
S3_UPLOAD_EXPIRY_MINUTES="10"
```

## S3 Bucket Configuration

> You are responsible for creating, managing and setting up an S3 bucket for direct uploads with appropriate permissions.

To allow direct uploads, the bucket should have a CORS policy (Permissions > Cross-origin resource sharing (CORS) section when viewing the S3 bucket in the AWS Console) based on the following:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "https://myapp.example.com"
        ],
        "ExposeHeaders": []
    }
]
```
> Note: Avoid adding a trailing slash to an origin as the upload will be denied.

If your app is running on `https://myapp.example.com/uploads` then add `https://myapp.example.com` as an AllowedOrigins entry per the example.
