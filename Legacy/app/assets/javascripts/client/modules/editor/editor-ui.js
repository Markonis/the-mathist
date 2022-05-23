/* global app $ */

app.modules.editor_ui = {

  init: function () {
    //add the elements
    var module = app.modules.editor_ui;
    module.editor_container = $('#editor-container');
    module.note_body_container = $('#note-body-container');
    module.home_btn = $('#home-btn');
    module.note = $('#note');
    module.note_body = $('#note-body');
    module.new_elements = $('#new-elements');
    module.note_title = $('#note-title');
    module.toggle_keyboard = $('#toggle-keyboard');

    module.share_btn = $('#share-btn');

    module.title_focused = false;

    module.home_btn.on('tap', function () {
      app.notify({
        type: "home_tap"
      });
    });

    module.editor_container.on('tap', function () {
      app.notify({
        type: "editor_container_tap"
      })
    });

    module.note.on('tap', function () {
      app.notify({
        type: "note_tap"
      });
    });

    module.note_title.on('focus', function () {
      app.notify({
        type: "note_title_focus"
      });
    });

    module.note_title.on('blur', function () {
      app.notify({
        type: "note_title_blur"
      });
    });

    $('.math-container').on('tap', function (event) {
        var $target = $(event.target);
        if ($target.hasClass('math-container')) {
          app.notify({
            type: "math_container_tap",
            data: {
              x: event.x,
              y: event.y
            }
          });
        }
        else if (!$target.hasClass('caret') &&
          $target.parents('.interactive').length == 0 &&
          $target.parents('.caret').length == 0 &&
          $target.parents('#autocomplete').length == 0
        ) {
          app.notify({
            type: "field_tap",
            data: {
              field: $target
            }
          });
        }
        else if (
          $target.parents('.interactive').length > 0
        ) {
          app.notify({
            type: 'interactive_field_tap'
          });
        }
      })
      .on('mousedown', function (event) {
        app.notify({
          type: 'math_container_mousedown',
          data: {
            math_container: $(this),
            event: event
          }
        });
      })
      .on('mouseup', function (event) {
        app.notify({
          type: 'math_container_mouseup',
          data: {
            math_container: $(this),
            event: event
          }
        });
      });

    module.toggle_keyboard.on('tap', function () {
      app.notify({
        type: "toggle_keyboard_tap"
      });
    });

    $('#arrows-container .btn').on('tap', function () {
      app.notify({
        type: "arrow_tap",
        data: {
          direction: $(this).attr('id').split('-')[0]
        }
      });
    });

    //prevent unwanted default browser behaviour, no need to notify the whole application about this
    $('input, textarea').focus(function (e) {
      e.preventDefault();
    });

    $(document).on("keydown", function (e) {
      if (e.which === 8 && !$(e.target).is("input:not([readonly]), textarea")) {
        e.preventDefault();
      }
    });

    app.notify({
      type: "module_ready",
      data: {
        name: "editor_ui"
      }
    });
  },

  actions: {
    window_resize: function (event) {
      var module = app.modules.editor_ui;
      var app_ui = app.modules.app_ui;
      var editor_height = app_ui.body.height() - app_ui.header.outerHeight(true);
      module.editor_container.css('height', editor_height);
    },

    home_tap: function () {
      app.functions.hash_change("home/notes");
    },

    note_title_focus: function (event) {
      var module = app.modules.editor_ui;
      module.title_focused = true;
      module.editor_container.removeClass('with-keyboard');
    },

    note_title_blur: function (event) {
      var module = app.modules.editor_ui;
      module.title_focused = false;
    },

    note_title_blur_press: function () {
      app.modules.editor_ui.note_title.trigger('blur');
    },

    math_container_mouseup: function (event) {
      var math_container = event.data.math_container;
      math_container.off('mousemove');
    },

    toggle_keyboard_tap: function (event) {
      var module = app.modules.editor_ui;
      module.editor_container.toggleClass('with-keyboard');
    },

    print: function () {
      window.print();
    },

    indicate_wa_tap: function () {
      var module = app.modules.editor_ui;
      module.note_body.toggleClass('indicate-wa');
    }
  }
}
