<?php

namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\UppyField;
use SilverStripe\Control\Controller;
use SilverStripe\Dev\SapphireTest;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\Form;

class FieldTest extends SapphireTest
{

    protected static $extra_controllers = [
        FieldTestController::class,
    ];
    public function setUp() : void {
        parent::setUp();
    }

    public function tearDown() : void {
        parent::tearDown();
    }

    /**
     * Test field configuration
     */
    public function testFieldConfig() {

        $controller = FieldTestController::create();

        $fields = FieldList::create(
            $field = UppyField::create('TestUpload', 'Test Upload')
        );
        $form = Form::create($controller, 'TestForm', $fields);

        // render the field
        $html = $field->forTemplate();

        $implementation = $field->config()->get('implementation');
        $c = $field->getUploaderConfig();

        $this->assertEquals($implementation['validation']['acceptFiles'], $c['validation']['acceptFiles']);
        $this->assertEquals($implementation['validation']['itemLimit'], $c['validation']['itemLimit']);
        $this->assertEquals($implementation['validation']['sizeLimit'], $c['validation']['sizeLimit']);

        $this->assertEquals($implementation['validation']['image']['maxWidth'], $c['validation']['image']['maxWidth']);
        $this->assertEquals($implementation['validation']['image']['maxHeight'], $c['validation']['image']['maxHeight']);
        $this->assertTrue(empty($implementation['validation']['image']['minWidth']));
        $this->assertTrue(empty($implementation['validation']['image']['minHeight']));

        $this->assertEquals(0, $c['validation']['minSizeLimit']);
        $this->assertEquals(
            $field->getExtensionsForTypes( explode(",", $c['validation']['acceptFiles']) ),
            $c['validation']['allowedExtensions']
        );
        $this->assertFalse($c['debug']);
        // delete
        $this->assertTrue($c['deleteFile']['forceConfirm']);
        $this->assertEquals('POST', $c['deleteFile']['method']);
        $this->assertTrue($c['deleteFile']['enabled']);
        $this->assertEquals('FieldTestController/TestForm/field/TestUpload/remove', $c['deleteFile']['endpoint']);
        $this->assertNotEmpty($c['deleteFile']['params']['SecurityID']);

        // messages
        $keys = [
            'emptyError',
            'noFilesError',
            'minSizeError',
            'maxHeightImageError',
            'maxWidthImageError',
            'minHeightImageError',
            'minWidthImageError',
            'tooManyItemsError',
            'typeError',
        ];
        foreach($keys as $key) {
            $this->assertNotEmpty($c['messages'][$key]);
        }

        $this->assertNotEmpty($c['text']['defaultResponseError']);

        // Upload request options
        $this->assertNotEmpty($c['request']['params']['SecurityID']);
        $this->assertEquals('POST', $c['request']['method']);
        $this->assertEquals('dfu_uuid', $c['request']['uuidName']);
        $this->assertEquals('FieldTestController/TestForm/field/TestUpload/upload', $c['request']['endpoint']);

        $doc = new \DOMDocument();
        $doc->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $tags = $doc->getElementsByTagName('div');
        $element = $tags[0];
        $config = $element->getAttribute('data-config');
        $config = json_decode($config, true);

        // config from getUploaderConfig should be the same as the config in the field HTML
        $this->assertEquals($c, $config);

    }
}
