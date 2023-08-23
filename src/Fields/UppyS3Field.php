<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Control\Controller;
use SilverStripe\View\Requirements;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

/**
 * A field to upload directly to S3 using the XHRUpload destination
 * The field gathers a pre-signed URL and provides that in the field
 * The upload goes directly to S3 via a PUT request and returns a result when done
 */
class UppyS3Field extends AbstractUppyExternalUploadField {

    use S3Upload;

    /**
     * Unique name for this service, used to select service used in forms
     * @var string
     */
    const SERVICE_NAME = 'AWS_S3_DIRECT_UPLOAD';

    /**
     * Description for this service
     * @var string
     */
    const SERVICE_DESCRIPTION = 'Upload files direct to S3';

    /**
     * @var array
     */
    private static $allowed_actions = [
        'notify', // notify of completed upload
        'presign' // return a presigned URL for a single file
    ];

    /**
     * @inheritdoc
     */
    public function getHttpUploadMethod() : string {
        return 'PUT';
    }

    /**
     * Pre sign a URL for a single file, called when a file is added to the uploader
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function presign(HTTPRequest $request) : HTTPResponse {
        $post = $request->postVars();
        $fileName = isset($post['id']) ? $post['id'] : '';
        $url = $this->generateSignedUrl($fileName);
        $response = [
            'presignedurl' => $url
        ];
        return (new HTTPResponse(json_encode($response), 200))->addHeader('Content-Type', 'application/json');
    }

    /**
     * @inheritdoc
     */
    public function notify(HTTPRequest $request) : HTTPResponse {
        return parent::notify($request);
    }

}
