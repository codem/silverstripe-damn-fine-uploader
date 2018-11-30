<%-- core fineuploader template using default.html example --%>

<div class="dfu-uploader-fp" id="$ID" data-name="$Name" data-config="$UploaderConfig">
    <% include FineUploaderMeta %>
    <input type="file" class="filepond" name="$Name" <% if $AcceptedItemLimit > 1 %>multiple<% end_if %>>
</div><!-- end dfu-uploader-fp -->
