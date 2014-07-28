jQuery-UI-reduceOptions-Plugin
==============================

Simple jQuery UI plugin that acts on grouped elements and allows hiding of unselected ones, toggle included.
You can see a working example at <a href="https://www.port-of-art.com">https://www.port-of-art.com</a> in the filter section in the left sidebar.

## Usage

```javascript
// prepare options for select option reduction
var options = {
  element_inner: 'input[type=checkbox]',
  element_outer: '.form-item',
  attribute: 'checked',
  value: 'checked',
  label_more: 'show all',
  label_less: 'show less',
  observe: 'ajaxSuccess',
  show: function(el) {
    $(el).fadeIn('slow');
  },
  hide: function(el) {
    $(el).hide();
  }
};
$('#element-id').reduceOptions(options);
```

This would work on markup like the following:
```
<div id="element-id">
  <div class="form-item">
    <input type="checkbox" name="mycheckbox_1" value="1" />
  </div>
  <div class="form-item">
    <input type="checkbox" name="mycheckbox_2" value="2" />
  </div>
  <div class="form-item">
    <input type="checkbox" name="mycheckbox_3" value="3" />
  </div>
</div>
```