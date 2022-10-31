<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Control\Controller;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Security\SecurityToken;
use SilverStripe\View\SSViewer;

/**
 * Test upload page field creation
 */
class UploadPageTest extends SapphireTest
{

    protected $usesDatabase = true;

    protected static $fixture_file = 'UploadPageTest.yml';

    public function setUp() : void {
        parent::setUp();
        SSViewer::set_themes([SSViewer::PUBLIC_THEME, SSViewer::DEFAULT_THEME]);
    }

    public function tearDown() : void {
        parent::tearDown();
    }

    public function testUploadPage() {
        $title = 'Test upload page';
        $fileTypes = ["jpeg","jpg","png","webp","pdf"];
        $expectedMimeTypes = "image/jpeg,image/png,image/webp,application/pdf";
        $fileUploadLimit = 3;
        $maxFileSizeMb = 3.5;
        $useDateFolder = 1;
        $formFieldTitle = "Form field title";
        $formFieldDescription = "Form field description";
        $formFieldRightTitle = "Form field right title";
        $formFieldUploadButtonTitle = "Upload now";
        $data = [
            'Title' => $title,
            'MaxFileSizeMB' => $maxFileSizeMb,
            'SelectedFileTypes' => json_encode($fileTypes),
            'FileUploadLimit' => $fileUploadLimit,
            'UseDateFolder' => $useDateFolder,
            'FormFieldTitle' => $formFieldTitle,
            'FormFieldDescription' => $formFieldDescription,
            'FormFieldRightTitle' => $formFieldRightTitle,
            'FormUploadButtonTitle' => $formFieldUploadButtonTitle
        ];
        $uploadPage = UploadPage::create($data);
        $uploadPage->write();

        $this->assertTrue($uploadPage->isInDB());
        $this->assertEquals( $fileTypes, json_decode($uploadPage->SelectedFileTypes) );
        $this->assertEquals( $maxFileSizeMb, $uploadPage->MaxFileSizeMB );
        $this->assertEquals( $useDateFolder, $uploadPage->UseDateFolder );
        $this->assertEquals( $fileUploadLimit, $uploadPage->FileUploadLimit );
        $this->assertEquals( $formFieldTitle, $uploadPage->FormFieldTitle );
        $this->assertEquals( $formFieldDescription, $uploadPage->FormFieldDescription );
        $this->assertEquals( $formFieldRightTitle, $uploadPage->FormFieldRightTitle );

        $folder = $uploadPage->Folder();
        $this->assertTrue($folder->exists());
        $this->assertTrue($folder->hasRestrictedAccess());

        $uploadPageController = UploadPageController::create( $uploadPage );

        $form = $uploadPageController->Form();
        $uploadField = $form->Fields()->dataFieldByName( UploadPageController::config()->get('upload_field_name') );

        $this->assertInstanceOf( DamnFineUploaderField::class, $uploadField);

        $formTemplate = $form->forTemplate();

        $dom = new \DOMDocument('1.0', 'utf-8');
        $dom->loadHTML($formTemplate, LIBXML_HTML_NODEFDTD);

        $element = $dom->getElementById($uploadField->ID());

        $this->assertTrue($element instanceof \DOMElement, 'Element not found or is not a DOMElement');
        $configData = $element->getAttribute('data-config');
        $config = json_decode($configData);

        $this->assertTrue($config && ($config instanceof \stdClass), 'Config is not valid');
        $this->assertEquals($config->validation->itemLimit, $fileUploadLimit, "Item limit does not match");

        $this->assertEquals($config->validation->sizeLimit, ($maxFileSizeMb * 1024 * 1024), "Item sizeLimit {$config->validation->sizeLimit} does not match => {$maxFileSizeMb}");

        // file types
        $this->assertEquals($expectedMimeTypes, $config->validation->acceptFiles, "Accept files does not match expected");

        $this->assertEquals($config->request->method, "POST", "Upload endpoint {$config->request->method} does not match POST");

        // test field upload link
        $uploadLink = Controller::join_links($form->FormAction(), $uploadField->UploadLink());
        $this->assertEquals($config->request->endpoint, $uploadLink, "Upload endpoint {$config->request->endpoint} does not match {$uploadLink}");

        // CSRF token
        $securityToken = $form->getSecurityToken();
        $this->assertTrue($securityToken instanceof SecurityToken, "Security Token in form is not valid");
        $tokenName = $securityToken->getName();
        $securityTokenValue = $securityToken->getValue();

        $this->assertTrue(!empty($config->request->params->{$tokenName}), "No {$tokenName} member in config/request/params");

        $this->assertEquals($securityTokenValue, $config->request->params->{$tokenName}, "Security Token value does not match {$securityTokenValue}");

    }

}
