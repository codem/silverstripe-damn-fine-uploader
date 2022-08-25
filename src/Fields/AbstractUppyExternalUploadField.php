<?php

namespace Codem\DamnFineUploader;

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

}
