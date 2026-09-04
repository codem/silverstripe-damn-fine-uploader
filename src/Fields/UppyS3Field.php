<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

/**
 * A field to upload directly to S3 using the XHRUpload destination
 * The field gathers a pre-signed URL and provides that in the field
 * The upload goes directly to S3 via a PUT request and returns a result when done
 */
class UppyS3Field extends AbstractUppyExternalUploadField
{
    use S3Upload;

    /**
     * Unique name for this service, used to select service used in forms
     * @var string
     */
    public const SERVICE_NAME = 'AWS_S3_DIRECT_UPLOAD';

    /**
     * Description for this service
     * @var string
     */
    public const SERVICE_DESCRIPTION = 'Upload files direct to S3';

    private static array $allowed_actions = [
        'notify', // notify of completed upload
        'presign' // return a presigned URL for a single file
    ];

    /**
     * Provide a specific notify method for this uploader
     */
    public function notify(HTTPRequest $request): HTTPResponse
    {
        return parent::notify($request);
    }

    /**
     * @inheritdoc
     */
    public function getHttpUploadMethod(): string
    {
        return 'PUT';
    }

    /**
     * Overrides the parent getServiceConfigValue method to
     * return configuration values from environment if appropriate
     */
    public function getServiceConfigValue(string $key): mixed
    {
        if (str_starts_with($key, 'S3_UPLOAD_')) {
            // return these values from the environment
            return \SilverStripe\Core\Environment::getEnv($key);
        }
        // return from the service configuration
        $config = $this->getServiceConfig();
        return $config[ $key ] ?? null;
    }

    /**
     * Pre sign a URL for a single file, called when a file is added to the uploader
     */
    public function presign(HTTPRequest $request): HTTPResponse
    {
        $post = $request->postVars();
        $fileName = $post['id'] ?? '';
        $url = $this->generateSignedUrl($fileName);
        $response = [
            'presignedurl' => $url
        ];
        return HTTPResponse::create(json_encode($response), 200)->addHeader('Content-Type', 'application/json');
    }

}
