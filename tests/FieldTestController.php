<?php

declare(strict_types=1);

namespace Codem\DamnFineUploader\Tests;

use SilverStripe\Control\Controller;
use SilverStripe\Dev\TestOnly;

/**
 * Controller for field tests
 */
class FieldTestController extends Controller implements TestOnly
{
    private static string $url_segment = 'FieldTestController';

}
