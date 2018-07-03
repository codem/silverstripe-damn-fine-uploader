<div class="dfu-uploader-meta">
  <ul>
  <li><strong>Allowed Extensions</strong>: $AcceptedExtensions</li>
  <li><strong>Maximum file size</strong>: {$AcceptedFileSize}MB</li>
  <li><strong>Maxmimum number of uploads</strong>: $AcceptedItemLimit</li>
  <% if AcceptsImages %>
    <% if AcceptsMaxDimensions %><li><strong>Maximum image dimensions</strong>: $AcceptsMaxDimensions pixels</li><% end_if %>
    <% if AcceptsMinDimensions %><li><strong>Minimum image dimensions</strong>: $AcceptsMinDimensions pixels</li><% end_if %>
  <% end_if %>
  </ul>
</div>
