/**
 * Reduce-Options jQuery UI Plugin
 *
 * Acts on grouped elements and allows to hide unselected ones initially if a
 * certain amount of elements is already selected. Provides a toggle element.
 *
 * by berliner
 * Git: https://github.com/berliner/jQuery-UI-reduceOptions-Plugin
 */
(function( $, undefined ) {

  $.widget("ui.reduceOptions", {  
    
    options: {
      wrapper: '',
      element_inner: '',
      element_outer: '',
      attribute: 'checked',
      value: 'checked',
      threshold: 1,
      label_more: 'more',
      label_less: 'less',
      show: function (el) {
        $(el).fadeIn('slow');
      },
      hide: function (el) {
        $(el).hide();
      }
    },
    
    _create: function() {
      var self = this;
      var wrapper = this.element;
      var o = self.options;

      var checked = 0;
      $(wrapper).find(o.element_inner).each(function() {
        if ($(this).attr(o.attribute) == o.value) {
          checked++;
        }
      });

      if (self.countSelected() > 0 && self.countSelected() < o.threshold) {
        return;
      }

      if (self.countSelected() == 0) {
        self.addLink({
          type: 'less',
          label: o.label_less,
          click: 'reduceOptions'
        });
      }
      else if (self.countElements() > self.countSelected()) {
        // hide the unselected options
        $(wrapper).find(o.element_inner + '[' + o.attribute + '!="' + o.value + '"]').each(function() {
          $(this).parent(o.element_outer).hide();
        });
        self.addLink({
          type: 'more',
          label: o.label_more,
          click: 'expandOptions'
        });
      }
      
      self.verifyLinkVisibility();
      
      self._on($(wrapper).find(o.element_inner), {
        change: 'verifyLinkVisibility'
      });

    },

    countElements: function() {
      var self = this;
      var wrapper = self.element;
      var o = self.options;
      return $(wrapper).find(o.element_inner).length;
    },

    countSelected: function() {
      var self = this;
      var wrapper = self.element;
      var o = self.options;
      var checked = 0;
      $(wrapper).find(o.element_inner).each(function() {
        if ($(this).attr(o.attribute) == o.value) {
          checked++;
        }
      });
      return checked;
    },

    verifyLinkVisibility: function() {
      var self = this;
      var o = self.options;
      var count = self.countElements();
      var selected = self.countSelected();
      if (selected == 0 || count == selected) {
        $(self.element).find('.ui-reduce-options-button').hide();
      }
      else {
        $(self.element).find('.ui-reduce-options-button').show();
      }
    },

    // less is clicked
    reduceOptions: function(e) {
      var element = e.currentTarget;
      var unchecked = 0;
      var self = this;
      var o = self.options;
      $(self.element).find(o.element_inner + '[' + o.attribute + '!="' + o.value + '"]').each(function() {
        o.hide($(this).parent(o.element_outer));
      });
      self.addLink({
        type: 'more',
        label: o.label_more,
        click: 'expandOptions'
      });
      e.preventDefault();
      return false;
    },

    // more is clicked
    expandOptions: function(e) {
      var element = e.currentTarget;
      var self = this;
      var o = self.options;
      o.show($(self.element).find(o.element_outer));
      self.addLink({
        type: 'less',
        label: o.label_less,
        click: 'reduceOptions'
      });
      e.preventDefault();
      return false;
    },
    
    // add a link to show/hide unselected options
    addLink: function(props) {
      $(this.element).find('.ui-reduce-options-button').remove();
      var link = $('<a>').attr({
        'class': 'ui-reduce-options-button ui-reduce-options-show-' + props.type,
        'href': '#',
        'title': props.label
      }).text(props.label);
      this._on(link, {
        click: props.click
      });
      $(this.element).append(link);
    }
    
  });
}( jQuery ));