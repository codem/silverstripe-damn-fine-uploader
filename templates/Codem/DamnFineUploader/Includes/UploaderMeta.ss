<div class="dfu-uploader-meta">
  <ul>
  <li><strong><%t DamnFineUploader.ALLOWED_FILES 'Allowed files' %></strong>: {$AcceptedExtensions}</li>
  <li><strong><%t DamnFineUploader.MAXIMUM_FILE_SIZE 'Maximum file size' %></strong>: {$AcceptedFileSize}MB</li>
  <% if $AcceptedMinFileSize %><li><strong><%t DamnFineUploader.MINIMUM_FILE_SIZE 'Minimum file size' %></strong>: {$AcceptedMinFileSize}MB</li><% end_if %>
  <li><strong><%t DamnFineUploader.MAXIMUM_NUMBER_OF_UPLOADS 'Maximum number of uploads' %></strong>: {$AcceptedItemLimit}</li>
  <% if AcceptsImages %>
    <% if AcceptedMaxDimensions %><li><strong><%t DamnFineUploader.MAXIMUM_IMAGE_DIMENSIONS 'Maximum image dimensions' %></strong>: {$AcceptedMaxDimensions} <%t DamnFineUploader.PIXELS 'pixels' %></li><% end_if %>
    <% if AcceptedMinDimensions %><li><strong><%t DamnFineUploader.MINIMUM_IMAGE_DIMENSIONS 'Minimum image dimensions' %></strong>: {$AcceptedMinDimensions} <%t DamnFineUploader.PIXELS 'pixels' %></li><% end_if %>
  <% end_if %>
  </ul>
</div><!-- end meta -->
