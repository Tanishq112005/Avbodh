import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class S3:
    def __init__(self):
        self.endpoint_url = settings.B2_ENDPOINT_URL
        self.application_key_id = settings.B2_APPLICATION_KEY_ID
        self.application_key = settings.B2_APPLICATION_KEY
        self.bucket_name = settings.B2_BUCKET_NAME

        if not all([self.endpoint_url, self.application_key_id, self.application_key, self.bucket_name]):
            logger.warning("Backblaze B2 credentials are not fully configured in settings.")
            self.s3_client = None
        else:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.application_key_id,
                aws_secret_access_key=self.application_key
            )
   
   
   
    ### upload the file and return the url for this , it might , we also get expires also 
    
    def upload_file(self, file_obj, object_name: str, content_type: str = None) -> str:
    
        if not self.s3_client:
            raise ValueError("S3 client is not initialized. Check your B2 credentials.")

        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type

            # upload_fileobj expects a file-like object
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                object_name,
                ExtraArgs=extra_args
            )
            
            # Construct the file URL (Backblaze B2 format)
            # Typically: <endpoint_url>/file/<bucket_name>/<object_name>
            return f"{self.endpoint_url}/file/{self.bucket_name}/{object_name}"
        except ClientError as e:
            logger.error(f"Error uploading file to B2: {e}")
            raise e
    
    
    
    ## upload the pdf in the s3 bucket 
    
    def upload_pdf(self, file_obj, object_name: str) -> str:
        """Helper method to upload a PDF file"""
        return self.upload_file(file_obj, object_name, content_type="application/pdf")


     ## upload the image in the s3 bucket 
    
    def upload_image(self, file_obj, object_name: str, content_type: str = "image/jpeg") -> str:
        """Helper method to upload an image file"""
        return self.upload_file(file_obj, object_name, content_type=content_type)
    
    
    
    ## get the file url 
    
    def get_file_url(self, object_name: str, expiration: int = 3600) -> str:
        if not self.s3_client:
            raise ValueError("S3 client is not initialized.")

        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Error generating presigned URL for B2: {e}")
            raise e
