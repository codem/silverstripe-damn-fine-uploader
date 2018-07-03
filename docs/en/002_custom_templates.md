# Using templates with the Core uploader field

> This doesn't apply to the UI field, which uses the standard FineUploader Gallery template

The core uploader field ships with a table-based HTML template:
```
<table data-use="container">
  <tr data-use="file"><! -- this represents a file upload submitted, in progress or completed -->
    <th data-use="filename"></th><! -- this represents the file name -->
    <td data-use="prg"></td><! -- this represents the upload progress, it will contain an HTML5 progress element -->
    <td data-use="msg"></td><! -- this represents upload status -->
    <td data-use="ops"></td><! -- this represents file operations (remove/delete) -->
  </tr>
</table>
```

Each ``<tr>`` represents a file submitted, in progress or completed. The cells of the ``<tr>`` give feedback.

You probably want to modify this template. To do so, implement your own
FileUploaderCoreField.ss template in your theme and add replace the HTML in the element ```dfu-uploader-core-template``` .

Provided the new HTML template has all the required data-use attributes, it should render.

## Basic Bootstrap example
```
<div class="container" data-use="container">
  <div class="row" data-use="file">
    <div class="col-sm-3" data-use="filename"></div>
    <div class="col-sm-3" data-use="prg"></div>
    <div class="col-sm-3" data-use="msg"></div>
    <div class="col-sm-3" data-use="ops"></div>
  </div>
</div>
```

## Basic [Responsive](https://responsivebp.com/) example
```
<div class="container" data-use="container">
  <div class="row" data-use="file">
    <div class="col-s-4" data-use="filename"></div>
    <div class="col-s-2" data-use="prg"></div>
    <div class="col-s-3" data-use="msg"></div>
    <div class="col-s-3" data-use="ops"></div>
  </div>
</div>
```

> The ```data-use``` attributes are important, don't change these.

It's deliberately un-opionated, you will need to apply your own CSS to decorate.
