<?php

namespace Codem\DamnFineUploader\Tests;

use Codem\DamnFineUploader\UppyField;
use Codem\DamnFineUploader\SubmittedUploadField;
use SilverStripe\Forms\LabelField;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Dev\TestAssetStore;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\FunctionalTest;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\Form;
use Silverstripe\Forms\HiddenField;
use SilverStripe\Security\SecurityToken;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\UserForms\Control\UserDefinedFormController;
use SilverStripe\UserForms\Extension\UserFormFileExtension;
use SilverStripe\UserForms\Model\UserDefinedForm;
use SilverStripe\UserForms\Model\EditableFormField\EditableTextField;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\SSViewer;


class UserFormFieldTest extends FunctionalTest
{

    protected static $fixture_file = 'UserFormFieldTest.yml';

    protected static $use_draft_site = false;
    protected static $disable_themes = true;

    private $fixture_file_count = 0;

    protected $usesDatabase = true;

    protected function setUp() : void
    {
        parent::setUp();
        // permission
        $this->logInWithPermission('ADMIN');

        // Set backend and base url
        TestAssetStore::activate('UserFormFieldTest');

        // set up files from fixture and save
        $files = File::get()->exclude('ClassName', Folder::class);
        foreach ($files as $file) {
            $sourcePath = __DIR__ . '/data/' . $file->Name;
            $file->setFromLocalFile($sourcePath, $file->Filename);
            $file->writeToStage(Versioned::DRAFT);
        }
        $this->fixture_file_count = $files->count();

        Config::modify()->merge(SSViewer::class, 'themes', ['simple', '$default']);

        // ensure tokens are enabled
        SecurityToken::enable();

        // Set basic image + document allowed extensions
        Config::modify()->set(
            File::class,
            'allowed_extensions',
            ['jpg', 'jpeg', 'png','gif', 'doc', 'docx', 'pdf', 'txt', 'csv']
        );

        // SiteConfig allows a subset
        $allowed = ['jpg', 'jpeg', 'png','gif', 'doc', 'docx', 'pdf'];
        $config = SiteConfig::current_site_config();
        // set a default set of images
        $config->AllowedFileExtensions = $allowed;
        $config->write();

    }

    public function tearDown() : void
    {
        parent::tearDown();
        TestAssetStore::reset();
    }

    /**
     * Publish a form for use on the frontend
     *
     * @param string $fixtureName
     * @return UserDefinedForm
     */
    protected function setupPage($fixtureName = 'basic-form-page')
    {
        $page = $this->objFromFixture(UserDefinedForm::class, $fixtureName);

        $this->actWithPermission('ADMIN', function () use ($page) {
            $page->publishRecursive();
        });

        return $page;
    }

    public function testFilesUploadedAndAttached()
    {

        // create the page
        $page = $this->setupPage('upload-form');

        // attach to controller
        $controller = UserDefinedFormController::create($page);

        // from fixture
        $field_name = "upload_field_name";

        //grab the form
        $form = $controller->Form();
        $fields = $form->Fields();
        $upload_field = $fields->fieldByName($field_name);
        $this->assertTrue($upload_field instanceof UppyField);

        $token = $form->getSecurityToken();
        $this->assertTrue($token instanceof SecurityToken);
        $token_value = $token->getValue();
        $this->assertNotEmpty($token_value, "Form security token value is empty");

        // update files with upload tokens to simulate an upload
        $files = File::get()->exclude(['ClassName' => Folder::class]);
        $this->assertEquals($this->fixture_file_count, $files->count(), "Files found should match fixture file count ({$this->fixture_file_count})");
        $file_ids = [];

        $data = [];
        foreach($form->Fields() as $field) {
            $data[ $field->getName() ] = $field->dataValue();
        }

        foreach($files as $file) {
            //create a pseudo upload token value for test purposes that can be compared against
            $upload_token_value = "upload_token_file{$file->ID}{$file->Name}";

            /**
             * Ensure the form gets a field to populate (this is done by JS in the browser)
             * This is done to ensure TestSession can populate form data properly
             */
            $upload_field_name = $field_name . "[file_upload_{$file->ID}]";
            $editable_dummy_field = EditableTextField::create([
                "Name" => $upload_field_name,
                "Title" => "Dummy form field for upload of #{$file->ID}"
            ]);
            $editable_dummy_field->write();

            // add the field to the page
            $page->Fields()->add(
                $editable_dummy_field
            );

            $file->IsDfuUpload = 1;
            // the stored file token is the upload token value concat'd with the security token value
            $dfu = "{$upload_token_value}|{$token_value}";
            $file->DFU = $dfu;
            $file->writeToStage(Versioned::DRAFT);
            $this->assertFalse($file->isPublished(), "File {#$file->ID} is published, it should not be");
            $file_ids[ $file->ID ] = true;
            $data[ $upload_field_name ] = $upload_token_value;
        }

        $page->write();
        $page->publishRecursive();

        // load the form (with the dummy textfields)
        $response = $this->get($page->URLSegment);
        // submit the form
        $response = $this->submitForm($form->FormName(), null, $data);

        // check submitted files
        $submitted = SubmittedUploadField::get();
        $this->assertEquals(1, $submitted->count(), "There should be one SubmittedUploadField");
        $submitted = $submitted->first();
        $submitted_files = $submitted->Files();
        $this->assertEquals(
            $this->fixture_file_count,
            $submitted_files->count(),
            "The stored submitted file count ({$submitted_files->count()}) does not match the fixture file count {$this->fixture_file_count}"
        );
        foreach($submitted_files as $submitted_file) {
            $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)
                    ->filter( [
                        'SubmittedUploadFieldID' => $submitted->ID,
                        'ID' => $submitted_file->ID
                    ] )->first();
            $this->assertTrue(
                array_key_exists($file->ID, $file_ids),
                "File linked to submitted upload field does not exist in list of files uploaded"
            );
            $this->assertEmpty($file->DFU, 'Upload token value from DB is not empty post-upload, it should be');
            $this->assertFalse($file->isPublished(), "File #{$file->ID} is published, it should not be");
            $this->assertEquals(UserFormFileExtension::USER_FORM_UPLOAD_TRUE, $file->UserFormUpload,  "File should be marked UserFormUpload=1");
            $this->assertEquals(1, $file->IsDfuUpload,  "File should be marked IsDfuUpload=1");
        }

    }
}
