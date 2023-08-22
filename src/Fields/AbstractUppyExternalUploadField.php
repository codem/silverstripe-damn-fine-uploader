<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Security\RandomGenerator;

/**
 * Fields that upload to an external location (eg S3) must extend this
 * @author James
 */
abstract class AbstractUppyExternalUploadField extends UppyField
{

    /**
     * External upload fields support notifications on upload
     * @var bool
     */
    protected $supportsNotifications = true;

    /**
     * @var array
     */
    protected $serviceConfig = [];

    /**
     * array of service classes linked to field
     * @var array
     */
    private static $uploadServices = [];

    /**
     * Generate a signed URL for upload to the external target
     */
    abstract public function generateSignedUrl(string $fileName) : string;

    /**
     * Get the service client
     */
    abstract public function getServiceClient() : ?object;

    /**
     * By default, external fields do not handle remove
     */
    public function remove(HTTPRequest $request) : HTTPResponse {
        $response = false;
        return (new HTTPResponse(json_encode($response), 400))->addHeader('Content-Type', 'application/json');
    }

    /**
     * By default, external fields do not handle upload as the request goes to an external URL
     */
    public function upload(HTTPRequest $request) : HTTPResponse {
        $response = false;
        return (new HTTPResponse(json_encode($response), 400))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Presign URL for the field
     * @return string
     */
    public function getPresignUrl() : string {
        $action = $this->getForm()->FormAction();
        $link = Controller::join_links($action, $this->PresignLink());
        return $link;
    }

    /**
     * @return string
     */
    final public static function getServiceName() : string {
        return static::SERVICE_NAME;
    }

    /**
     * @return string
     */
    final public static function getServiceDescription() : string {
        return static::SERVICE_DESCRIPTION;
    }

    /**
     * Return the upload field linked to the service name
     * @return self|null
     */
    public static function getUploadField($serviceName, $args = []) : ?self {
        self::getUploadServices();
        $field = null;
        if(isset(self::$uploadServices[ $serviceName ])) {
            // link to field
            $serviceClasses = self::getUploadFields();
            foreach($serviceClasses as $serviceClass) {
                if($serviceClass::getServiceName() == $serviceName) {
                    $field = Injector::inst()->createWithArgs(
                        $serviceClass,
                        $args
                    );
                    $serviceConfig = Config::inst()->get(
                        $serviceClass,
                        'serviceConfig'
                    );
                    $field->setServiceConfig( $serviceConfig );
                    break;
                }
            }
        }
        return $field;
    }

    /**
     * Get a list of classes representing fields that are children of this class
     */
    public static function getUploadFields() : array {
        $fields = ClassInfo::subclassesFor( self::class, false );
        return $fields;
    }

    /**
     * Get an array of services linked to fields being children of this class
     */
    public static function getUploadServices() : array {
        if(!empty(self::$uploadServices)) {
            return self::$uploadServices;
        }
        self::$uploadServices = [];
        $serviceClasses = self::getUploadFields();
        foreach($serviceClasses as $serviceClass) {
            self::$uploadServices[ $serviceClass::getServiceName() ] = $serviceClass::getServiceDescription();
        }
        return self::$uploadServices;
    }

    /**
     * Generate the upload hash
     */
    public function generateUploadHash() : string {
        $generator = new RandomGenerator();
        $token = $generator->randomToken('sha256');
        return $token;
    }

    /**
     * Get a service configuration value
     */
    public function setServiceConfig(array $config) : self {
        $this->serviceConfig = $config;
        return $this;
    }

    /**
     * Get the service configuration
     */
    public function getServiceConfig() : array {
        return $this->serviceConfig;
    }

    /**
     * Get a value from configuration
     * @return mixed
     */
    public function getServiceConfigValue(string $key) {
        $value = array_key_exists($key, $this->serviceConfig) ? $this->serviceConfig[ $key ] : null;
        return $value;
    }

    /**
      * Handle notification received after upload success, error or completion
      * For completion the POST data will have a 'completed' key
      * For per file completion notifications, the POST data will have a id being the uploader file id
      * along with name, size, type and uuid keys
      * The uuid is the value included in a {@link self::upload()} response
      *
      * This method simply notifies extends of a completed upload or completed batch
      * by passing the request value to the extension
      *
      * @param HTTPRequest $request
      * @return HTTPResponse
      */
    public function notify(HTTPRequest $request) : HTTPResponse {
        try {

            $response = false;
            $post = $request->postVars();

            if(isset($post['uri'])) {

                $form = $this->getForm();
                $securityToken = $form->getSecurityToken();
                $tokenValue = $securityToken->getValue();
                $tokenName = $securityToken->getName();

                if(empty($post['meta'])) {
                    throw new \Exception("Missing meta key in the submitted notification");
                }

                // Validate token in meta, token value must match the value for this field's form
                $meta = json_decode($post['meta'], true, 512, JSON_THROW_ON_ERROR);
                if(empty($meta[ $tokenName ])) {
                    throw new \Exception("No security token in the submitted notification");
                }
                if($meta[ $tokenName ] !== $tokenValue) {
                    throw new \Exception("Security token value does not match the expected value");
                }

                // single file upload completion
                $externalUpload = ExternalUpload::create([
                    'ServiceName' => static::getServiceName(),
                    'ServiceTitle' => static::getServiceDescription(),
                    'Title' => isset($post['name']) ? $post['name'] : '',
                    'Description' => '',
                    'IsSuccess' => isset($post['result']) ? $post['result'] : 0,
                    'UploadSize' => isset($post['size']) ? $post['size'] : 0,
                    'UploadType' => isset($post['type']) ? $post['type'] : '',
                    'UploadHash' => isset($post['id']) ? $post['id'] : '',
                    'UploadUri' => isset($post['uri']) ? $post['uri'] : '',
                    'UploadSrc' => isset($post['src']) ? $post['src'] : '',
                    'UploadBatchId' => ''
                ]);
                $id = $externalUpload->write();
            }
            $response = true;
        } catch (\Exception $e) {
            // failed to notify
            $response = false;
            Logger::log("Failed notify() post upload: " . $e->getMessage(), "NOTICE");
        } finally {
            return (new HTTPResponse(json_encode($response), 200))->addHeader('Content-Type', 'application/json');
        }
    }

    /**
     * For external destinations, there is no limit (override in subclass)
     * Return bytes being the max upload size for the destination
     * @return int
     */
    public function getSystemAllowedMaxFileSize()
    {
        return 0;
    }

}
