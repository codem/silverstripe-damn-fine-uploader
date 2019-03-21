<?php
namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\FineUploaderCoreField;
use Codem\DamnFineUploader\FineUploaderField;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Validator;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Control\Controller;
use PageController;

class UploadFieldTest extends SapphireTest
{
    public function testFieldConfiguration()
    {
        $fields = FieldList::create();
        $actions = FieldList::create();
        $controller = new PageController();
        $form = new Form($controller, "TestForm", $fields, $actions);
        ;

        $bytes = 1048576;
        $max_filesize = 2 * $bytes;
        $min_filesize = 8 * $bytes;

        $field = FineUploaderField::create('JustTesting', 'Just Testing');
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
}
