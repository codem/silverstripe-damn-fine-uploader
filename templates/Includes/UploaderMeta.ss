<div class="dfu-uploader-meta">
  <ul>
  <li><strong>Allowed Extensions</strong>: $AcceptedExtensions</li>
  <li><strong>Maximum file size</strong>: {$AcceptedFileSize}MB</li>
  <% if $AcceptedMinFileSize %><li><strong>Minimum file size</strong>: {$AcceptedMinFileSize}MB</li><% end_if %>
  <li><strong>Maximum number of uploads</strong>: $AcceptedItemLimit</li>
  <% if AcceptsImages %>
    <% if AcceptedMaxDimensions %><li><strong>Maximum image dimensions</strong>: $AcceptedMaxDimensions pixels</li><% end_if %>
    <% if AcceptedMinDimensions %><li><strong>Minimum image dimensions</strong>: $AcceptedMinDimensions pixels</li><% end_if %>
  <% end_if %>
  </ul>
</div><!-- end meta -->
