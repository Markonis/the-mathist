/* global app $*/

app.modules.keyboard = {
  init: function () {
    var module = app.modules.keyboard;
    module.auto_forward = false;
    module.letters_case = 0;
    module.language = 0;
    module.key_template = $('<div class="key"></div>');

    module.functions.activate_physical_keyboard();
    app.notify({
      type: "module_ready",
      data: {
        name: "keyboard"
      }
    });
  },

  actions: {},

  functions: {
    activate_physical_keyboard: function () {
      var editor = app.modules.editor;

      $(document).keydown(function (event) {
        if (editor.formula_mode) {
          switch (event.which) {
          case 8:
            app.notify({
              type: 'backspace_tap'
            });
            break;
          case 9:
            app.notify({
              type: "arrow_tap",
              data: {
                direction: "right"
              }
            });
            event.preventDefault();
            break;
          case 32: // Space
            app.notify({
              type: 'space_tap'
            });
            event.preventDefault();
            break;
          case 37: // left arrow
            if (event.metaKey) {
              app.notify({
                type: "home_key_press"
              });
            }
            else {
              app.notify({
                type: "arrow_tap",
                data: {
                  direction: "left"
                }
              });
            }
            event.preventDefault();
            break;
          case 38: // up arrow
            app.notify({
              type: "arrow_tap",
              data: {
                direction: "up"
              }
            });
            event.preventDefault();
            break;
          case 39: // right arrow
            if (event.metaKey) {
              app.notify({
                type: "end_key_press"
              });
            }
            else {
              app.notify({
                type: "arrow_tap",
                data: {
                  direction: "right"
                }
              });
            }
            event.preventDefault();
            break;
          case 40: // down arrow
            app.notify({
              type: "arrow_tap",
              data: {
                direction: "down"
              }
            });
            event.preventDefault();
            break;
          case 46: // delete
            app.notify({
              type: "delete_press"
            });
            break;
          case 65: // a - select all
            if (event.ctrlKey || event.metaKey) {
              app.notify({
                type: 'select_all'
              });
              event.preventDefault();
            }
            break;
          case 67: // c - copy
            if (event.ctrlKey || event.metaKey) {
              app.notify({
                type: 'copy'
              });
              event.preventDefault();
            }
            break;
          case 86: // v - paste
            if (event.ctrlKey || event.metaKey) {
              app.notify({
                type: 'paste'
              });
              event.preventDefault();
            }
          case 89: // y - redo
            if (event.ctrlKey || event.metaKey) {
              app.notify({
                type: 'redo_tap'
              });
              event.preventDefault();
            }
            break;
          case 90: // z - undo
            if (event.ctrlKey || event.metaKey) {
              app.notify({
                type: 'undo_tap'
              });
              event.preventDefault();
            }
            break;
          case 222:
            editor.functions.write_character('\'');
            event.preventDefault();
          }
        }
      });

      $(document).keyup(function (event) {
        switch (event.which) {
        case 9: // tab
          event.preventDefault();
          app.notify({
            type: 'tab_press'
          });
          break;
        case 13:
          app.notify({
            type: 'enter_press'
          });
          break;
        case 27: // escape
          app.notify({
            type: "escape_press"
          });
          break;
        case 35: // End
          app.notify({
            type: 'end_key_press'
          });
          event.preventDefault();
          break;
        case 36: // Home
          app.notify({
            type: 'home_key_press'
          });
          event.preventDefault();
          break;
        }
      });


      // letters
      $(document).keypress(function (event) {
        var editor = app.modules.editor;
        if (editor.formula_mode) {
          var blocked = "0 8 9 13 16 27 127";
          if (blocked.indexOf(String(event.which)) == -1) {
            var current_char = String.fromCharCode(event.which);

            var complex_conversions = {
              "^": function () {
                app.notify({
                  type: 'radial_field_tap',
                  data: {
                    radial_class: 'radial-tr'
                  }
                });
              },

              "_": function () {
                app.notify({
                  type: 'radial_field_tap',
                  data: {
                    radial_class: 'radial-br'
                  }
                });
              },

              "/": function () {
                event.preventDefault();

                var caret = app.modules.writing_tools.carets[0];
                var caret_prev = caret.prev();
                var caret_grandparent = caret.parent().parent();
                var contents = null;
                var word = null;

                if (caret_prev.hasClass('word')) {
                  contents = caret_prev.children().first().children();
                  word = caret_prev;
                }
                else {
                  contents = editor.functions.get_prev({
                    until: /complex-field|margin-field|space|punctuation|line-break/
                  });
                  if (caret_grandparent.hasClass('word'))
                    word = caret_grandparent;
                }

                var fraction = editor.expression_templates.algebra.Fraction.clone();
                editor.functions.write_element(fraction);

                if (contents.length > 0) {
                  for (var i = 0; i < contents.length; i++)
                    fraction.children().first().append($(contents[i]));

                  app.notify({
                    type: 'field_tap',
                    data: {
                      field: fraction.children().last()
                    }
                  });
                }

                if (word) word.remove(); // Clean up the word
              },

              "(": function () {
                app.notify({
                  type: 'open_bracket',
                  data: {
                    character: '('
                  }
                });
              },

              "[": function () {
                app.notify({
                  type: 'open_bracket',
                  data: {
                    character: '['
                  }
                });
              },

              "{": function () {
                app.notify({
                  type: 'open_bracket',
                  data: {
                    character: '{'
                  }
                });
              },

              ")": function () {
                app.notify({
                  type: 'close_bracket'
                });
              },

              "]": function () {
                app.notify({
                  type: 'close_bracket'
                });
              },

              "}": function () {
                app.notify({
                  type: 'close_bracket'
                });
              }
            };

            if (complex_conversions.hasOwnProperty(current_char)) {
              complex_conversions[current_char]();
              app.notify({
                type: 'key_tap'
              });
            }
            else if (!(event.ctrlKey || event.metaKey)) {
              editor.functions.write_character(current_char);
            }
          }
        }
      });
    }
  }
};
