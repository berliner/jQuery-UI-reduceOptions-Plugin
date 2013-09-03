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
      observe: '',
      show: function (el) {
        $(el).fadeIn('slow');
      },
      hide: function (el) {
        $(el).hide();
      },
      after_update: null
    },
    
    /**
     * Constructor for this widget.
     */
    _create: function() {
      var self = this;
      var wrapper = this.element;
      var o = self.options;
      
      self.options.wrapper = wrapper;
      
      if (o.observe) {
        $(document).on(o.observe, function() {
          self.update();
        });
      }

      self.update();
      
      self._on($(wrapper).find(o.element_inner), {
        change: 'verifyLinkVisibility'
      });

    },

    /**
     * Count all relevant elements in this set.
     */
    countElements: function() {
      var self = this;
      var wrapper = self.element;
      var o = self.options;
      return $(wrapper).find(o.element_inner).length;
    },

    /**
     * Count the selected elements in the current set.
     */
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

    /**
     * See if and which toggle links should be visible.
     */
    verifyLinkVisibility: function() {
      var self = this;
      var o = self.options;
      var count = self.countElements();
      var selected = self.countSelected();
      if ((selected == 0 && !self.collapsed) || count == selected) {
        $(self.element).find('.ui-reduce-options-button').hide();
      }
      else {
        $(self.element).find('.ui-reduce-options-button').show();
      }
    },
    
    /**
     * Show all elements in the set.
     */
    showAll: function() {
      var self = this;
      // make sure all are visible
      $(self.options.wrapper).find(self.options.element_inner).each(function() {
        self.options.show($(this).parent(self.options.element_outer));
      });
    },
    
    /**
     * Hide all elements in the set.
     */
    hideAll: function() {
      var self = this;
      // make sure all are visible
      $(self.options.wrapper).find(self.options.element_inner).each(function() {
        self.options.hide($(this).parent(self.options.element_outer));
      });
    },
    
    /**
     * Hide all unselected elements in the current set.
     */
    hideUnselected: function() {
      var self = this;
      var o = self.options;
      $(self.element).find(o.element_inner + '[' + o.attribute + '!="' + o.value + '"]').each(function() {
        o.hide($(this).parent(o.element_outer));
      });
    },
    
    /**
     * Reduce elements in given set.
     * The argument e is an event object.
     */
    reduceOptions: function(e) {
      this.hideUnselected();
      this.addMoreLink();
      this.collapsed = true;
      e.preventDefault();
      return false;
    },

    /**
     * Expand elements in given set.
     * The argument e is an event object.
     */
    expandOptions: function(e) {
      this.showAll();
      this.removeLink();
      this.addLessLink();
      this.collapsed = false;
      this.verifyLinkVisibility();
      e.preventDefault();
      return false;
    },
    
    /**
     * Link builder helper function.
     */
    addLink: function(props) {
      this.removeLink();
      var link = $('<a>').attr({
        'class': 'ui-reduce-options-button ui-reduce-options-show-' + props.type,
        'href': '#',
        'title': props.label
      }).text(props.label);
      this._on(link, {
        click: props.click
      });
      $(this.element).append(link);
    },
    
    /**
     * Remove the mode/less link.
     */
    removeLink: function() {
      $(this.element).find('.ui-reduce-options-button').remove();
    },
    
    /**
     * Add a "more" link.
     */
    addMoreLink: function() {
      this.addLink({
        type: 'more',
        label: this.options.label_more,
        click: 'expandOptions'
      });
    },
    
    /**
     * Add a "less" link.
     */
    addLessLink: function() {
      this.addLink({
        type: 'less',
        label: this.options.label_less,
        click: 'reduceOptions'
      });
    },
    
    /**
     * Update the current element set.
     */
    update: function() {
      var self = this;
      var wrapper = this.element;
      var o = self.options;
      if (self.countSelected() == 0) {
        self.showAll();
        self.addLessLink();
        self.collapsed = false;
      }
      else if (self.countElements() > self.countSelected()) {
        // hide the unselected options
        self.hideUnselected();
        self.collapsed = true;
        self.addMoreLink();
      }
      self.verifyLinkVisibility();
      if (o.after_update) {
        o.after_update(self);
      }
    }
    
  });
}( jQuery ));