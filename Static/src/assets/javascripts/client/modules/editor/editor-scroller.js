/* global app $ */

app.modules.editor_scroller = {
  init: function () {
    var module = app.modules.editor_scroller;
    module.final_scroll = null;
    module.animator = null;
    app.notify({type: 'module_ready', data: {name: 'editor_scroller'}});
  },

  actions: {
    caret_moved: function (event) {
      app.modules.editor_scroller.functions
        .scroll_to_element(event.data.caret);
    },

    caret_jumped: function (event) {
      app.modules.editor_scroller.functions
        .scroll_to_element(app.modules.writing_tools.carets[0]);
    },

    autocomplete_shown: function() {
      var module = app.modules.editor_scroller;
      var popup = app.modules.autocomplete.popup;
      module.functions.scroll_to_element(popup);
    }
  },

  functions: {
    scroll_to_element: function (element) {
      var module = app.modules.editor_scroller;

      var element_bounds = module.functions.element_bounds(element);
      if(!module.functions.should_scroll(element_bounds)) return;

      element_bounds = module.functions.element_bounds(element);
      var final_scroll = module.functions.calculate_final_scroll(element_bounds);

      if(final_scroll != null) {
        module.functions.set_final_scroll(final_scroll);
      }
    },

    calculate_final_scroll: function(element_bounds) {
      var editor_ui = app.modules.editor_ui;
      var note_body_container = editor_ui.note_body_container;
      var note_body_container_offset = note_body_container.offset();
      var current_scroll = note_body_container[0].scrollTop;

      var dist = null;

      if(element_bounds.top < note_body_container_offset.top){
        dist = element_bounds.top - note_body_container_offset.top;
        return current_scroll + dist;
      }else if(element_bounds.bottom > note_body_container_offset.top + note_body_container.height()){
        dist = element_bounds.bottom - note_body_container.height() - note_body_container_offset.top;
        return current_scroll + dist;
      }else{
        return null;
      }
    },

    element_bounds: function(element) {
      var element_top = element.offset().top;
      var element_bottom = element.offset().top + element.height();
      if(element.hasClass('caret')){
        var handle = element.children('.caret-handle').first();
        element_bottom = handle.offset().top + handle.height();
      }
      return {top: element_top, bottom: element_bottom};
    },

    should_scroll: function(element_bounds) {
      var editor_ui = app.modules.editor_ui;
      var note_body_container = editor_ui.note_body_container;
      var note_body_container_offset = note_body_container.offset();

      return (element_bounds.top < note_body_container_offset.top) ||
        (element_bounds.bottom > note_body_container_offset.top + note_body_container.height());
    },

    set_final_scroll: function(scroll) {
      var module = app.modules.editor_scroller;
      module.final_scroll = scroll;
      if(module.animator == null){
        module.animator = module.functions.create_animator();
      }
    },

    create_animator: function() {
      var module = app.modules.editor_scroller;
      var editor_ui = app.modules.editor_ui;
      var note_body_container = editor_ui.note_body_container;
      var max_speed = 100;

      function ease(t) {
        return t * t;
      }

      function animate() {
        var current_scroll = note_body_container[0].scrollTop;
        var dist = Math.abs(module.final_scroll - current_scroll);
        var dir = Math.sign(module.final_scroll - current_scroll);
        var speed = ease(Math.min(dist, max_speed) / max_speed) * max_speed / 2;
        if(speed < 1){
          module.functions.stop_animator();
        }else{
          current_scroll += dir * speed;
          note_body_container[0].scrollTop = current_scroll;
        }
      }

      return setInterval(animate, 25);
    },

    stop_animator: function () {
      var module = app.modules.editor_scroller;
      window.clearInterval(module.animator);
      module.animator = null;
    }
  }
};
