<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Control\Controller;
use SilverStripe\Dev\TestOnly;

/**
 * Controller for field tests
 */
class FieldTestController extends Controller implements TestOnly
{
    public function __construct()
    {
        parent::__construct();
    }

    private static $url_segment = 'FieldTestController';

}
