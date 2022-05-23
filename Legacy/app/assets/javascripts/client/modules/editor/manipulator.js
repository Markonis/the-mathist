/* global app $ */

app.modules.manipulator = {
  init: function () {
    var module = app.modules.manipulator;

    module.template = $(
      '<div class="absolute manipulator">' +
        '<div class="absolute manipulator-handle n-handle"></div>' +
        '<div class="absolute manipulator-handle e-handle"></div>' +
        '<div class="absolute manipulator-handle s-handle"></div>' +
        '<div class="absolute manipulator-handle w-handle"></div>' +
        '<div class="absolute manipulator-handle ne-handle"></div>' +
        '<div class="absolute manipulator-handle se-handle"></div>' +
        '<div class="absolute manipulator-handle sw-handle"></div>' +
        '<div class="absolute manipulator-handle nw-handle"></div>' +
      '</div>');

    app.notify({type: 'module_ready', data: {name: 'manipulator'}});

    module.current_manipulated = null;
  },

  actions: {
    math_container_mousedown: function (event) {
      var module = app.modules.manipulator;
      var target = $(event.data.event.target);

      function should_manipulate() {
        return target.hasClass('manipulator-handle');
      }

      if(should_manipulate()) {
        var manipulator = target.parent();
        module.functions.start_manipulation(manipulator, event);
      }
    },

    math_container_mouseup: function () {
      var module = app.modules.manipulator;
      $('.manipulator').removeClass('active');
      if(module.current_manipulated) {
        app.notify({type: 'manipulation_finished', data: {manipulated: module.current_manipulated}});
      }
      module.current_manipulated = null;
    }
  },

  functions: {
    append_to: function (element) {
      var module = app.modules.manipulator;
      var manipulator = module.template.clone();
      element.append(manipulator);
    },

    start_manipulation: function(manipulator, event) {
      var module = app.modules.manipulator;
      var math_container = manipulator.parents('.math-container').first();
      var manipulated = manipulator.siblings().first();

      manipulator.addClass('active');
      module.current_manipulated = manipulated;

      var start_offset = {left: event.data.event.clientX, top: event.data.event.clientY};
      var start_size = { width: manipulated.width(), height: manipulated.height() };

      math_container.on('mousemove', function (move_event) {
        var offset = {left: move_event.clientX, top: move_event.clientY};

        var size = {
          width: start_size.width + (offset.left - start_offset.left),
          height: start_size.height + (offset.top - start_offset.top)
        };

        manipulated.width(size.width);
        manipulated.height(size.height);
      });
    }
  }
};
