<%-- core fineuploader template using default.html example --%>

<div class="dfu-uploader-core" id="$ID" data-name="$Name" data-config="$UploaderConfig">
    <% include FineUploaderMeta %>
  <div class="dfu-uploader-core-button" id="{$ID}-button">Upload</div>
  <div class="dfu-uploader-core-template" style="display:none!important;">

      <table data-use="container">
        <tr data-use="file">
          <th data-use="filename"></th>
          <td data-use="prg"></td>
          <td data-use="msg"></td>
          <td data-use="ops"></td>
        </tr>
      </table>

  </div>
  <div class="dfu-uploader-core-files"></div>
</div>
