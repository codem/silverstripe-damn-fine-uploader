<?php
namespace Codem\DamnFineUploader;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\File;
use SilverStripe\Forms\Fieldlist;

class FileExtension extends DataExtension {

  private static $db = [
    'DFU' => 'Varchar(64)',
  ];

  private static $indexes = [
    'DFU' => ['type' => 'unique', 'columns' => ['DFU'] ]
  ];

}
