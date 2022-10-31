<?php

namespace Codem\DamnFineUploader;

use Aws\Credentials\Credentials;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;

/**
 * Trait to configure direct S3 Uploads
 * Used in conjunction with ExternalUpload
 * @author James
 */
trait S3Upload
{

    /**
     * Generate a signed URL for upload to the external target
     * @param string $fileName
     */
    public function generateSignedUrl(string $fileName = '') : string {
        $serviceClient = $this->getServiceClient();
        $bucket = $this->getServiceConfigValue('S3_BUCKET');

        if($fileName == '') {
            $fileName = $this->generateUploadHash();
        }

        // ensure the key has no / in it
        $fileName = str_replace("/", "-", $fileName);

        $cmd = $serviceClient->getCommand(
            'PutObject', [
                'Bucket' => $bucket,
                'Key' => $fileName
            ]
        );

        $expiry = intval($this->getServiceConfigValue('UPLOAD_EXPIRY_MINUTES'));
        $request = $serviceClient->createPresignedRequest(
            $cmd,
            "+{$expiry} minutes"
        );
        $presignedUrl = (string)$request->getUri();
        return $presignedUrl;
    }

    /**
     * Get the service client
     */
    public function getServiceClient() : ?object {

         $options = [
             'region'  => $this->getServiceConfigValue('S3_REGION'),
             'version' => $this->getServiceConfigValue('API_VERSION')
         ];

         /**
          * Credentials only passed if it is set.
          * If not set, infrastructure is expected to have assumed role to run s3 transactions
          */
         if( ($awsKeyId = $this->getServiceConfigValue('AWS_ACCESS_KEY_ID'))
             && ($awsSecretAccessKey = $this->getServiceConfigValue('AWS_SECRET_ACCESS_KEY'))
         ) {
             $options['credentials'] = new Credentials(
                 $awsKeyId,
                 $awsSecretAccessKey
             );
         }

         if($endpoint = $this->getServiceConfigValue('ENDPOINT')) {
             $options['endpoint'] = $endpoint;
         }

         if($usePathStyleEndpoint = $this->getServiceConfigValue('USE_PATH_STYLE_ENDPOINT')) {
             $options['use_path_style_endpoint'] = $usePathStyleEndpoint;
         }

         if($debug = $this->getServiceConfigValue('DEBUG')) {
             $options['debug'] = $debug;
         }

         return new S3Client($options);

    }

}
