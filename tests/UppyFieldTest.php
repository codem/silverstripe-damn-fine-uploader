<?php

namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\DamnFineUploaderField;
use Codem\DamnFineUploader\UploadPage;
use Codem\DamnFineUploader\UppyField;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\Form;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Validator;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use PageController;
use DOMDocument;
use DOMElement;
use stdClass;

/**
 * Unit test to verify field handling
 * @author Codem
 */
class UppyFieldTest extends SapphireTest
{

    /**
     * Test field configuration and settings
     */
    public function testFieldConfiguration()
    {
        $fields = FieldList::create();
        $actions = FieldList::create();
        $controller = new PageController();
        $form = new Form($controller, "TestForm", $fields, $actions);

        $bytes = 1048576;
        $max_filesize = 2 * $bytes;
        $min_filesize = 8 * $bytes;

        $input_types = ['image/jpg','image/jpeg', 'image/gif', 'text/x-php'];
        $field = UppyField::create('JustTesting', 'Just Testing');
        $field->setForm($form);
        $field->setAllowedMaxItemLimit(5)
                // php should be filtered out...
                ->setAcceptedTypes($input_types)
                ->setAcceptedMaxDimensions(2560, 1440)
                ->setAcceptedMinDimensions(800, 600)
                ->setAcceptedMaxFileSize($max_filesize)
                ->setAcceptedMinFileSize($min_filesize)
                ->setDescription('A description');

        // configures the field
        $result = $field->Field();

        $system_max_filesize = $field->getSystemAllowedMaxFileSize();
        $resolved_max_filesize = min($system_max_filesize, $max_filesize);

        $expected_extensions = "gif, jpe, jpeg, jpg";
        $expected_types = ['image/jpg','image/jpeg', 'image/gif'];
        $expected_max_filesize = $resolved_max_filesize;
        $expected_min_filesize = 0;// as > max
        $expected_max_width = 2560;
        $expected_max_height = 1440;
        $expected_min_width = 800;
        $expected_min_height = 600;
        $expected_item_limit = 5;
        $expected_accepts_images = true;

        $returned_types = $field->getAcceptedTypes();
        $returned_extensions = $field->AcceptedExtensions();
        $returned_max_filesize = $field->AcceptedFileSize() * $bytes;
        $returned_min_filesize = $field->AcceptedMinFileSize() * $bytes;

        $returned_max_dimensions = $field->AcceptedMaxDimensions();
        $returned_min_dimensions = $field->AcceptedMinDimensions();

        $this->assertEquals( array_intersect($returned_types, $input_types), $expected_types, "Returned types does not match expected allowed file types" );
        $this->assertTrue($returned_extensions == $expected_extensions, "Extensions does not match {$expected_extensions} got {$returned_extensions}");
        $this->assertTrue($returned_max_filesize == $expected_max_filesize, "FileSize does not match {$expected_max_filesize} got {$returned_max_filesize}");
        $this->assertTrue($returned_min_filesize == $expected_min_filesize, "Extensions does not match {$expected_min_filesize} got {$returned_min_filesize}");
        $this->assertTrue($field->AcceptedItemLimit() == $expected_item_limit, "Extensions does not match {$expected_extensions}");

        $this->assertTrue($field->AcceptedMaxWidth() == $expected_max_width, "Max Width does not match {$expected_max_width}");
        $this->assertTrue($field->AcceptedMaxHeight() == $expected_max_height, "Max Width does not match {$expected_max_height}");
        $this->assertTrue($returned_max_dimensions == "{$expected_max_width}×{$expected_max_height}", "Max Dimensions does not match '{$expected_max_width}×{$expected_max_height}' got '{$returned_max_dimensions}'");

        $this->assertTrue($field->AcceptedMinWidth() == $expected_min_width, "Min Width does not match {$expected_min_width}");
        $this->assertTrue($field->AcceptedMinHeight() == $expected_min_height, "Min Width does not match {$expected_min_height}");
        $this->assertTrue($returned_min_dimensions == "{$expected_min_width}×{$expected_min_height}", "Min Dimensions does not match '{$expected_min_width}×{$expected_min_height}' got '{$returned_min_dimensions}'");

        $this->assertTrue($field->AcceptsImages() == $expected_accepts_images, "Accepts images should be true");
    }

    public function testRenderedField()
    {
        $fields = FieldList::create();
        $actions = FieldList::create();
        $controller = new PageController();
        $form = new Form($controller, "TestForm", $fields, $actions);

        $bytes = 1048576;//1 MB
        $max_filesize = 1 * $bytes;
        $min_filesize = 0.5 * $bytes;

        $item_limit = 5;
        $accepted_types = ['image/jpg','image/jpeg', 'image/gif'];

        $max_width = 2560;
        $max_height = 1440;

        $min_width = 800;
        $min_height = 600;

        $field = UppyField::create('JustTesting', 'Just Testing');
        $field->setForm($form);
        $field->setAllowedMaxItemLimit($item_limit)
                ->setAcceptedTypes($accepted_types)
                ->setAcceptedMaxDimensions($max_width, $max_height)
                ->setAcceptedMinDimensions($min_width, $min_height)
                ->setAcceptedMaxFileSize($max_filesize)
                ->setAcceptedMinFileSize($min_filesize)
                ->setDescription('A description');

        // configures the field
        $template = $field->Field();

        $dom = new DOMDocument('1.0', 'utf-8');
        $dom->loadHTML($template, LIBXML_HTML_NODEFDTD);

        $element = $dom->getElementById($field->ID());

        $this->assertTrue($element instanceof DOMElement, 'Element not found or is not a DOMElement');
        $config_attribute = $element->getAttribute('data-config');
        $config = json_decode($config_attribute);

        $this->assertTrue($config && $config instanceof stdClass, 'Config is not valid');
        $this->assertEquals($config->validation->itemLimit, $item_limit, "Item limit does not match");
        $this->assertEquals($config->validation->image->maxWidth, $max_width, "Item maxWidth does not match");
        $this->assertEquals($config->validation->image->maxHeight, $max_height, "Item maxHeight does not match");
        $this->assertEquals($config->validation->image->minWidth, $min_width, "Item minWidth does not match");
        $this->assertEquals($config->validation->image->minHeight, $min_height, "Item minHeight does not match");

        $this->assertEquals($config->validation->sizeLimit, $max_filesize, "Item sizeLimit {$config->validation->sizeLimit} does not match => {$max_filesize}");
        $this->assertEquals($config->validation->minSizeLimit, $min_filesize, "Item minSizeLimit {$config->validation->minSizeLimit} does not match => {$min_filesize}");

        // file types
        $this->assertNotEmpty($config->validation->acceptFiles, "Accept Files is empty");
        $config_accept_files = explode(",", $config->validation->acceptFiles);
        sort($config_accept_files);
        sort($accepted_types);

        $this->assertEquals(json_encode($config_accept_files), json_encode($accepted_types), "File accepted types do not match");

        $this->assertEquals($config->request->method, "POST", "Upload endpoint {$config->request->method} does not match POST");

        $upload_link = Controller::join_links($form->FormAction(), $field->UploadLink());
        $this->assertEquals($config->request->endpoint, $upload_link, "Upload endpoint {$config->request->endpoint} does not match {$upload_link}");

        $security_token = $form->getSecurityToken();
        $this->assertTrue($security_token instanceof SecurityToken, "Security Token in form is not valid");
        $token_name = $security_token->getName();
        $security_token_value = $security_token->getValue();

        $this->assertTrue(!empty($config->request->params->{$token_name}), "No {$token_name} member in config/request/params");

        $this->assertEquals($security_token_value, $config->request->params->{$token_name}, "Security Token value does not match {$security_token_value}");
    }

    /**
     * Setting empty accepted types
     */
    public function testSetEmptyAcceptedTypes() {
        $field = UppyField::create('DefaultAcceptedTypes', 'Default accepted types');
        $field->setAcceptedTypes([]);// will override any configuration value
        $field->initFieldConfig();
        $acceptedTypes = $field->getAcceptedTypes();
        $expectedTypes = $field->getDefaultAcceptedTypes();
        $this->assertEquals($expectedTypes, implode(",", $acceptedTypes));
    }

    public function testAcceptedTypes() {
        Config::modify()->merge(
            DamnFineUploaderField::class,
            'denied_types',
            [
                '.bmp',
            ]
        );
        $types = [".jpg",".png",".jpeg",".bmp"];
        $field = UppyField::create('AcceptedTypes', 'Accepted types');
        $field->setAcceptedTypes($types);
        $field->initFieldConfig();
        $acceptedTypes = $field->getAcceptedTypes();
        $expectedTypes = [".jpg",".png",".jpeg"];
        $this->assertEquals($expectedTypes, $acceptedTypes);
    }

    public function testDeniedTypes() {
        Config::modify()->set(
            DamnFineUploaderField::class,
            'denied_mimetypes',
            [
                'text/x-no', 'text/denied'
            ]
        );
        Config::modify()->set(
            DamnFineUploaderField::class,
            'denied_types',
            [
                '.no',
                '.denied'
            ]
        );
        $types = [".jpg",".denied"];
        $field = UppyField::create('DeniedTypes', 'Denied types');
        $field->setAcceptedTypes($types);
        $field->initFieldConfig();
        $this->assertTrue( $field->isDeniedMimeType('text/denied') );
        $acceptedTypes = $field->getAcceptedTypes();
        $expectedTypes = [".jpg"];
        $this->assertEquals($expectedTypes, $acceptedTypes);
    }

    /**
     * Test filterTypes method
     */
    public function testFilterTypes() {
        Config::modify()->set(
            DamnFineUploaderField::class,
            'denied_mimetypes',
            [
                'text/x-no', 'text/denied','image/not-allowed'
            ]
        );
        Config::modify()->set(
            DamnFineUploaderField::class,
            'denied_types',
            [
                '.no',
                '.denied',
                '.other'
            ]
        );
        $types = [".other", " ", "", ".webp", "image/*", "image/not-allowed"];
        $field = UppyField::create('FilterTypes', 'Filter types');
        $field->setAcceptedTypes($types);
        $field->initFieldConfig();
        $filterTypes = $field->filterTypes($types);
        $expectedTypes = [".webp","image/*"];
        $this->assertEquals($expectedTypes, $filterTypes);
    }

    /**
     * Test wildcard category/* handling
     */
    public function testWildcardTypes() {
        $types = ["image/*"];
        $field = UppyField::create('WildcardTypes', 'Wildcard types');
        $field->setAcceptedTypes($types);
        $field->initFieldConfig();
        $acceptedTypes = $field->getAcceptedTypes();
        $this->assertEquals( $types, $acceptedTypes );
        $acceptedExtensions = $field->getExtensionsForTypes( $acceptedTypes );
        $this->assertNotEmpty( $acceptedExtensions );
        // test for well know image types
        foreach(["jpg","png","pcx","bmp","png", "jpeg","gif"] as $extension) {
            $this->assertContains( $extension, $acceptedExtensions );
        }
    }


}
