/* global app $ */

app.modules.autocomplete = {
  init: function () {
    var module = app.modules.autocomplete;
    module.active = false;

    module.popup = $('#autocomplete').detach();
    module.popup_table = module.popup.children().first();

    module.recent = "";
    module.chosen_index = -1;
    module.matched_list = [];

    //register events
    var editor_ui = app.modules.editor_ui;
    var note_body = editor_ui.note_body;

    note_body.on('tap', '#autocomplete tr', function () {
      var $this = $(this);
      module.chosen_index = $this.parent().children().index($this);
      app.notify({
        type: 'autocomplete_choose'
      });
    });

    //timer
    module.timer = null;
    module.delay_factor = 1;
    module.max_delay = 1700; //maximally wait 1.7 seconds before showing autocomplete
    module.min_delay = 500;
    module.last_time = null;

    //notify ready
    app.notify({
      type: 'module_ready',
      data: {
        name: 'autocomplete'
      }
    });
  },

  actions: {
    key_tap: function (event) {
      var module = app.modules.autocomplete;
      var current_time = (new Date()).getTime();
      var wait_time = 0;

      if (module.active) {
        module.functions.hide();
      }

      if (module.timer) {
        clearTimeout(module.timer);
      }

      if (module.last_time) {
        wait_time = Math.max(Math.min((current_time - module.last_time) * module.delay_factor, module.max_delay), module.min_delay);
      }
      else {
        wait_time = module.max_delay;
      }

      module.timer = setTimeout(function () {
        var editor = app.modules.editor;
        if (editor.formula_mode) {
          var prev_fields = editor.functions.get_prev({
            until: /complex-field|margin-field|glued-field|line-break/
          });

          module.recent = "";

          for (var i = 0; i < prev_fields.length; i++)
            module.recent += prev_fields[i].text();

          module.functions.populate();
          if (module.matched_list.length > 0) {
            module.functions.show();
          }
          else {
            module.functions.hide();
          }
        }
      }, wait_time);

      module.last_time = current_time;
    },

    navigate_autocomplete: function (event) {
      var module = app.modules.autocomplete;
      var dir = event.data.direction;
      if (module.active) {

        var chosen_index = module.chosen_index;
        var list = module.matched_list;

        if (chosen_index > -1) {
          list[chosen_index].removeClass('chosen');
        }

        if (dir == "up") {
          if (chosen_index > 0) {
            chosen_index--;
          }
          else {
            chosen_index = list.length - 1;
          }
          module.chosen_index = chosen_index;
        }
        else if (dir == "down") {
          if (chosen_index < list.length - 1) {
            chosen_index++;
          }
          else {
            chosen_index = 0;
          }
          module.chosen_index = chosen_index;
        }
        else if (dir == "right") {
          if (chosen_index > -1) {
            app.notify({
              type: 'autocomplete_choose'
            });
          }
          else {
            module.functions.hide();
          }
        }
        else if (dir == "left") {
          module.functions.hide();
        }

        if (chosen_index > -1) {
          list[chosen_index].addClass('chosen');
        }
      }
    },

    arrow_hold: function (event) {
      if (app.modules.editor.formula_mode && event.data.direction == "left") {
        app.modules.autocomplete.functions.hide();
      }
    },

    autocomplete_choose: function () {
      var module = app.modules.autocomplete;
      if (module.chosen_index > -1) {
        var chosen_element = module.matched_list[module.chosen_index];
        module.functions.hide();
        app.notify({
          type: 'autocomplete_chosen',
          data: {
            container: chosen_element.children().last(),
            num_letters: chosen_element.attr('letters')
          }
        });
      }
    },

    escape_press: function () {
      app.modules.autocomplete.functions.hide();
    },

    delete_press: function () {
      app.modules.autocomplete.functions.hide();
    },

    caret_jumped: function () {
      app.modules.autocomplete.functions.hide();
    },

    note_title_focus: function () {
      app.modules.autocomplete.functions.hide();
    },

    note_tap: function () {
      app.modules.autocomplete.functions.hide();
    },

    caret_handle_drag_start: function () {
      app.modules.autocomplete.functions.hide();
    },

    caret_handle_tap: function () {
      app.modules.autocomplete.functions.hide();
    },

    selected: function () {
      app.modules.autocomplete.functions.hide();
    },

    hide_autocomplete: function () {
      app.modules.autocomplete.functions.hide();
    }
  },

  functions: {
    populate: function () {
      var module = app.modules.autocomplete;
      if (module.recent.length > 0) {
        var expressions = app.modules.editor.expression_templates;
        var matched = [];
        module.matched_list = [];
        var max_letters = 0;
        var low_recent = module.recent.toLowerCase();

        $.each(expressions, function (group, list) {
          $.each(list, function (name, html) {
            var low_name = name.toLowerCase();
            var match = true;
            for (var n = 0, r = 0; r < low_recent.length; r++) {
              if (low_recent.charAt(r) == low_name.charAt(n)) {
                n++;
                match = true;
              }
              else {
                if (low_recent.charAt(r) == low_name.charAt(0)) {
                  n = 1;
                }
                else {
                  match = false;
                  n = 0;
                }
              }
            }

            if (n > max_letters) {
              max_letters = n;
            }

            if (match) {
              var entry = {
                name: name,
                html: html,
                n: n
              };
              if (matched.length > 0) {
                for (var i = 0; i < matched.length; i++) {
                  if (n > matched[i].n) {
                    matched.splice(i, 0, entry);
                    break;
                  }
                  else if (i == matched.length - 1) {
                    matched.push(entry);
                    break;
                  }
                }
              }
              else {
                matched.push(entry);
              }
            }
          });
        });

        var popup_table = module.popup_table;
        popup_table.children().remove();
        if (matched.length > 0) {
          for (var i = 0; i < matched.length; i++) {

            var tr = $('<tr letters="' + matched[i].n + '"></tr>');
            popup_table.append(tr);

            tr.append($('<td>' + matched[i].name + '</td>'));
            tr.append($('<td>').append(matched[i].html.clone()));

            module.matched_list.push(tr);
          }
        }
      }
      else {
        module.matched_list = [];
      }
    },

    show: function () {
      var module = app.modules.autocomplete;
      app.modules.writing_tools.carets[0].append(module.popup);
      module.active = true;
      module.chosen_index = -1;
      app.notify({
        type: 'autocomplete_shown'
      });
    },

    hide: function () {
      var module = app.modules.autocomplete;
      module.popup.detach();
      module.active = false;
      module.matched_list = [];
      module.chosen_index = -1;
    }
  }
};
