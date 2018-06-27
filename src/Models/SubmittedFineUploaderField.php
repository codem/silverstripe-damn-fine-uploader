<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;
use SilverStripe\ORM\FieldType\DBField;

class SubmittedFineUploaderField extends SubmittedFormField {

    private static $many_many = array(
        'Files' => File::class
    );

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedFineUploaderField';

    /**
     * Abuse magic setter to get the $data and stores multiple files.
     * ie. $submittedField->Value = $field->getValueFromData($data);
     *
     * @return SubmittedFineUploaderField
     */
    public function setValue($ids) {
        if ($ids) {
            $files = File::get()->filter(array(
                'ID' => $ids,
            ));
            foreach ($files as $file) {
                $this->Files()->add($file);
            }
        }
        return $this;
    }

    /**
     * Return the value of this field for inclusion into things such as
     * reports.
     *
     * @return string
     */
    public function getFormattedValue()
    {
        $title = _t('SubmittedFileField.DOWNLOADFILE', 'Download File');

        $files = array();
        foreach ($this->Files() as $i => $file) {
            $files[] = sprintf(
                '%s - <a href="%s" target="_blank">%s</a>',
                $file->Name, $file->URL, $title
            );
        }
        return DBField::create_field('HTMLText', implode('<br/>', $files));
    }

    /**
     * Return the value for this field in the CSV export.
     *
     * @return string
     */
    public function getExportValue()
    {
        $links = array();
        foreach ($this->Files() as $file) {
            $links[] = $file->URL;
        }
        return implode('|', $links);
    }
}
