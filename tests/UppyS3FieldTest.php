<?php

namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\UppyS3Field;
use Codem\DamnFineUploader\AbstractUppyExternalUploadField;
use SilverStripe\Dev\SapphireTest;

/**
 * Unit test to verify field handling
 * @author Codem
 */
class UppyS3FieldTest extends SapphireTest
{

    /**
     * Test service name value
     */
    public function testServiceName()
    {
        $serviceName = UppyS3Field::getServiceName();
        $this->assertEquals(UppyS3Field::SERVICE_NAME, $serviceName);
    }

    /**
     * Test service description value
     */
    public function testServiceDescription()
    {
        $serviceDescription = UppyS3Field::getServiceDescription();
        $this->assertEquals(UppyS3Field::SERVICE_DESCRIPTION, $serviceDescription);
    }

}
