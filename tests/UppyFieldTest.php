<?php
namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\UppyField;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\Form;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Validator;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Control\Controller;
use PageController;
use DOMDocument;
use DOMElement;
use stdClass;

class UppyFieldTest extends SapphireTest
{
    public function testFieldConfiguration()
    {
        $fields = FieldList::create();
        $actions = FieldList::create();
        $controller = new PageController();
        $form = new Form($controller, "TestForm", $fields, $actions);

        $bytes = 1048576;
        $max_filesize = 2 * $bytes;
        $min_filesize = 8 * $bytes;

        $field = UppyField::create('JustTesting', 'Just Testing');
        $field->setForm($form);
        $field->setAllowedMaxItemLimit(5)
                ->setAcceptedTypes(['image/jpg','image/jpeg', 'image/gif'])
                ->setAcceptedMaxDimensions(2560, 1440)
                ->setAcceptedMinDimensions(800, 600)
                ->setAcceptedMaxFileSize($max_filesize)
                ->setAcceptedMinFileSize($min_filesize)
                ->setDescription('A description');

        // configures the field
        $result = $field->Field();

        $system_max_filesize = $field->getSystemAllowedMaxFileSize();
        $resolved_max_filesize = min($system_max_filesize, $max_filesize);

        $expected_extensions = "jpe, jpeg, jpg, gif";
        $expected_max_filesize = $resolved_max_filesize;
        $expected_min_filesize = 0;// as > max
        $expected_max_width = 2560;
        $expected_max_height = 1440;
        $expected_min_width = 800;
        $expected_min_height = 600;
        $expected_item_limit = 5;
        $expected_accepts_images = true;

        $returned_extensions = $field->AcceptedExtensions();
        $returned_max_filesize = $field->AcceptedFileSize() * $bytes;
        $returned_min_filesize = $field->AcceptedMinFileSize() * $bytes;

        $returned_max_dimensions = $field->AcceptedMaxDimensions();
        $returned_min_dimensions = $field->AcceptedMinDimensions();

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

    public function testRenderedField() {

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
        $dom->loadHTML( $template, LIBXML_HTML_NODEFDTD);

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
        $config_accept_files = explode("," , $config->validation->acceptFiles);
        sort($config_accept_files);
        sort($accepted_types);

        $this->assertEquals(json_encode($config_accept_files), json_encode($accepted_types), "File accepted types do not match");

        $this->assertEquals($config->request->method, "POST", "Upload endpoint {$config->request->method} does not match POST");

        $upload_link = Controller::join_links($form->FormAction(), $field->UploadLink());
        $this->assertEquals($config->request->endpoint, $upload_link, "Upload endpoint {$config->request->endpoint} does not match {$upload_link}");

        $security_token = $form->getSecurityToken();
        $this->assertTrue( $security_token instanceof SecurityToken, "Security Token in form is not valid" );
        $token_name = $security_token->getName();
        $security_token_value = $security_token->getValue();

        $this->assertTrue( !empty($config->request->params->{$token_name}), "No {$token_name} member in config/request/params");

        $this->assertEquals( $security_token_value, $config->request->params->{$token_name}, "Security Token value does not match {$security_token_value}" );

    }
}
