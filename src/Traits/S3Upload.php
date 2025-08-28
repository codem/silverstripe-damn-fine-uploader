<?php

namespace Codem\DamnFineUploader;

use Aws\Credentials\Credentials;
use Aws\S3\S3Client;

/**
 * Trait to configure direct S3 Uploads
 * Used by fields that extend the AbstractUppyExternalUploadField
 * See UppyS3Field for an example
 * @author James
 */
trait S3Upload
{
    /**
     * Generate a signed URL for upload to the external target
     */
    public function generateSignedUrl(string $fileName = ''): string
    {
        $serviceClient = $this->getServiceClient();
        if(!$serviceClient instanceof S3Client) {
            Logger::log("Error: the S3Client could not be created", "NOTICE");
            return '';
        }
        $bucket = $this->getServiceConfigValue('S3_UPLOAD_AWS_S3_BUCKET');

        if ($fileName === '') {
            $fileName = $this->generateUploadHash();
        }

        // ensure the key has no / in it
        $fileName = str_replace("/", "-", $fileName);

        $cmd = $serviceClient->getCommand(
            'PutObject',
            [
                'Bucket' => $bucket,
                'Key' => $fileName
            ]
        );

        $expiry = intval($this->getServiceConfigValue('S3_UPLOAD_EXPIRY_MINUTES'));
        $request = $serviceClient->createPresignedRequest(
            $cmd,
            "+{$expiry} minutes"
        );
        return (string)$request->getUri();
    }

    /**
     * Get the service client
     */
    public function getServiceClient(): ?object
    {


        if (!class_exists(S3Client::class) || !class_exists(Credentials::class)) {
            return null;
        }

        $region = $this->getServiceConfigValue('S3_UPLOAD_AWS_S3_REGION');
        if(!is_string($region) || $region == "") {
            Logger::log("Error: invalid S3_UPLOAD_AWS_S3_REGION value - expected an AWS region string", "NOTICE");
            return null;
        }
        $version = $this->getServiceConfigValue('S3_UPLOAD_AWS_API_VERSION');
        if(!is_string($version) || $version == "") {
            Logger::log("Error: invalid S3_UPLOAD_AWS_API_VERSION value - expected an AWS version string", "NOTICE");
            return null;
        }

        $options = [
            'region'  => $region,
            'version' => $version
        ];

        /**
         * Credentials only passed if it is set.
         * If not set, infrastructure is expected to have assumed role to run s3 transactions
         */
        if (($awsKeyId = $this->getServiceConfigValue('S3_UPLOAD_AWS_ACCESS_KEY_ID'))
            && ($awsSecretAccessKey = $this->getServiceConfigValue('S3_UPLOAD_AWS_SECRET_ACCESS_KEY'))
        ) {
            $options['credentials'] = new Credentials(
                $awsKeyId,
                $awsSecretAccessKey
            );
        }

        if ($endpoint = $this->getServiceConfigValue('S3_UPLOAD_AWS_ENDPOINT')) {
            $options['endpoint'] = $endpoint;
        }

        $usePathStyleEndpoint = $this->getServiceConfigValue('S3_UPLOAD_AWS_USE_PATH_STYLE_ENDPOINT');
        if ($usePathStyleEndpoint && strtolower($usePathStyleEndpoint) !== "false") {
            $options['use_path_style_endpoint'] = true;
        }

        $debug = $this->getServiceConfigValue('S3_UPLOAD_AWS_DEBUG');
        if ($debug && strtolower($debug) !== "false") {
            $options['debug'] = true;
        }

        return new S3Client($options);

    }

}
