/* global app $ */

app.modules.coordinator = {
  init: function () {
    var module = app.modules.coordinator;
    module.sequences = {
      'key_tap': ['autocomplete', 'editor']
    };

    app.notify = function (event) {
      var event_type = event.type;
      var notified_modules = {};
      var sequences = module.sequences;

      // if there is a special sequence of eventa defined,
      // call them in the specified order on the modules
      if (sequences.hasOwnProperty(event_type)) {
        var sequence = sequences[event_type];
        for (var i = 0; i < sequence.length; i++) {
          if (app.modules.hasOwnProperty[sequence[i]]) {
            // call the action directly on the module
            app.modules[sequence[i]].actions[event_type](event);
            // make sure not to call it again later
            notified_modules[sequence[i]] = true;
          }
        }
      }

      // call the action on all other modules
      $.each(app.modules, function (name, module) {
        if (!notified_modules.hasOwnProperty(name) && module.actions.hasOwnProperty(event_type)) {
          module.actions[event_type](event);
        }
      });
    };
  },

  post_init: function () {
    app.notify({
      type: 'module_ready',
      data: {
        name: 'coordinator'
      }
    });
  },

  // calls the appropriate actions based on the context
  // basically maps low-level events to higher-level events
  actions: {
    arrow_tap: function (event) {
      if (app.modules.editor_ui.title_focused && event.data.direction == 'down')
        app.notify({
          type: 'note_title_blur_press'
        });
      else if (app.modules.autocomplete.active)
        app.notify({
          type: 'navigate_autocomplete',
          data: event.data
        });
      else {

        app.notify({
          type: 'move_caret',
          data: {
            direction: event.data.direction,
            reason: 'moving'
          }
        });
      }
    },

    space_tap: function () {
      var autocomplete = app.modules.autocomplete;
      if (autocomplete.active && autocomplete.chosen_index > -1)
        app.notify({
          type: 'autocomplete_choose'
        });
      else
        app.notify({
          type: 'write_space'
        });
    },

    enter_press: function () {
      var autocomplete = app.modules.autocomplete;
      if (autocomplete.active && autocomplete.chosen_index > -1)
        app.notify({
          type: 'autocomplete_choose'
        });
      else if (app.modules.editor_ui.title_focused)
        app.notify({
          type: 'note_title_blur_press'
        });
      else
        app.notify({
          type: 'add_new_line'
        });
    },

    tab_press: function () {
      if (app.modules.editor_ui.title_focused)
        app.notify({
          type: 'note_title_blur_press'
        });
    }
  }
};
