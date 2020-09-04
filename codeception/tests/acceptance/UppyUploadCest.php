<?php
namespace DamnFineUploader;

/**
 * Test for UppyField loaded in a page
 * @author James
 */
class UppyUploadCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function uploadTestWorks(AcceptanceTester $I)
    {

        $path = getenv('DFU_UPPY_PATH');
        $I->assertNotEmpty($path, "DFU_UPPY_PATH not configured in your .env file!");

        $path = rtrim($path, "/") . "/";//ensure a correct trailiing slash

        $wait  = (int)getenv('DFU_UPLOAD_WAIT');
        if (!$wait || $wait <= 0) {
            $wait = 5;
        }

        $form_id = getenv('DFU_FORM_ID');
        $I->assertNotEmpty($form_id, "DFU_FORM_ID not configured in your .env file!");

        $form_id_path = $form_id;
        $form_id = "Form_{$form_id}";

        $I->amOnPage($path);
        $I->see('Drop files here, paste or browse');

        $I->seeElement("form#{$form_id} .uppy .dfu-uploader-uppy");

        $config_value = $I->grabAttributeFrom("form#{$form_id} .dfu-uploader-uppy", "data-config");
        $config = json_decode($config_value);

        if (empty($config->validation->itemLimit) || $config->validation->itemLimit <= 0 || $config->validation->itemLimit > 3) {
            $I->assertTrue(false, "itemLimit not in field config or is invalid (For this test, file limit must be between 1 and 3)");
        }

        if (empty($config->validation->acceptFiles)) {
            $I->assertTrue(false, "required setting acceptFiles is not in field config");
        }

        $item_limit = $config->validation->itemLimit;
        $uploads = 0;
        $selector = "form#{$form_id} .uppy input.uppy-Dashboard-input[type=\"file\"]";
        for ($i=1;$i<=$item_limit;$i++) {
            $I->seeElementInDOM($selector);
            $I->attachFile($selector, "jpg/{$i}.jpg");
            $attached_file_selector = "form#{$form_id} .uppy .uppy-Dashboard-Item .uppy-Dashboard-Item-name[title=\"{$i}.jpg\"]";
            $I->seeElementInDOM($attached_file_selector);
            $I->wait(0.5);//wait for animation to complete
            $uploads++;
            if ($i == $item_limit) {
                //reached the limit of files
                break;
            }
            // otherwise we add another one
            $I->seeElement("form#{$form_id} .uppy button.uppy-DashboardContent-addMore");
            $I->click("form#{$form_id} .uppy button.uppy-DashboardContent-addMore");
        }


        $I->seeElementInDOM("form#{$form_id} .uppy .uppy-StatusBar-actionBtn--upload");
        $I->click("form#{$form_id} .uppy .uppy-StatusBar-actionBtn--upload");

        $I->wait($wait);//wait for upload to finish, default = 10s

        $title = $I->grabTextFrom("form#{$form_id} .uppy .uppy-DashboardContent-title");
        $I->assertEquals('Upload complete', $title);

        // get the file references returned by the backend
        $inputs = $I->grabMultiple("form#{$form_id} input.dfu_uploaded_file[type=\"hidden\"]", "value");

        // inputs must match the number of uploads
        $I->assertEquals(count($inputs), $item_limit);

        $security_token_value = $config->request->params->SecurityID;

        $values = 0;
        $dfu_token_values = [];
        foreach ($inputs as $value) {
            // check in database
            $dfu_token_value = $value . "|" . $security_token_value;
            $dfu_token_values[] = $dfu_token_value;
            $I->seeInDatabase('File', ['DFU' => $dfu_token_value ]);// file should exist in draft
            $I->dontSeeInDatabase('File_Live', ['DFU' => $dfu_token_value ]);// file should not be published
            $values++;
        }

        // check the values found match the attempted upload count
        $I->assertEquals($values, $uploads);

        $I->click("form#{$form_id} input[type=submit]");

        foreach ($dfu_token_values as $dfu_token_value) {
            $I->see($dfu_token_value);
            // The DFU token should no longer be present
            $I->dontSeeInDatabase('File', ['DFU' => $dfu_token_value ]);
        }
        $I->see("Count:{$values}");
    }
}
