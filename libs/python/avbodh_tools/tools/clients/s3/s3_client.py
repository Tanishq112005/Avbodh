import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class AvbodhS3Client:
    def __init__(
        self,
        endpoint_url: str,
        region_name: str,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        bucket_name: str
    ):
        """
        Initialize the S3 Client for Backblaze B2 (or any S3 compatible storage).
        
        Args:
            endpoint_url: The S3 endpoint (e.g., https://s3.us-west-004.backblazeb2.com)
            region_name: The region (e.g., us-west-004)
            aws_access_key_id: The Backblaze Key ID
            aws_secret_access_key: The Backblaze App Key
            bucket_name: The target bucket name
        """
        self.bucket_name = bucket_name
        self.s3_client = boto3.client(
            's3',
            endpoint_url=endpoint_url,
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            config=Config(signature_version='s3v4')
        )

    def upload_file(self, file_path: str, object_name: Optional[str] = None) -> bool:
        """
        Upload a file to the S3 bucket.
        """
        if object_name is None:
            object_name = file_path

        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_name)
            logger.info(f"Successfully uploaded {file_path} to {object_name}")
            return True
        except ClientError as e:
            logger.error(f"Failed to upload {file_path}: {e}")
            return False

    def download_file(self, object_name: str, file_path: str) -> bool:
        """
        Download a file from the S3 bucket.
        """
        try:
            self.s3_client.download_file(self.bucket_name, object_name, file_path)
            logger.info(f"Successfully downloaded {object_name} to {file_path}")
            return True
        except ClientError as e:
            logger.error(f"Failed to download {object_name}: {e}")
            return False

    def get_presigned_url(self, object_name: str, expiration: int = 3600) -> Optional[str]:
        """
        Generate a presigned URL to share an S3 object.
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL for {object_name}: {e}")
            return None
