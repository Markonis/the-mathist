/* global app $ */

app.modules.writing_tools = {
  init: function () {
    var module = app.modules.writing_tools;
    module.selection = null;
    module.clipboard = null;
    module.select_mode = false;
    module.selection_color = '#ACF';

    //create carets
    module.carets = [
      $('<div class="caret"><div class="caret-handle absolute icon btn"></div></div>')
    ];
    module.carets.push(module.carets[0].clone().addClass('right'));

    module.caret_ghost = $('<div id="caret-ghost" class="caret"></div>');
    module.caret_ghost_timer = null;
    module.dragging = false;
  },

  post_init: function () {
    var editor_ui = app.modules.editor_ui;

    editor_ui.note_body.on('hold', '.simple-field', function (event) {
      app.notify({
        type: 'simple_field_hold',
        data: {
          field: $(event.target)
        }
      });
    });

    app.notify({
      type: 'module_ready',
      data: {
        name: 'writing_tools'
      }
    });
  },

  actions: {
    math_container_mousedown: function (event) {
      var module = app.modules.writing_tools;

      function should_select() {
        var target = $(event.data.event.target);
        return !target.hasClass('caret-handle') &&
          !target.hasClass('manipulator-handle');
      }

      if (should_select()) {
        module.functions.start_selection(event);
      }
    },

    math_container_mouseup: function (event) {
      var module = app.modules.writing_tools;
      module.dragging = false;
    },

    simple_field_hold: function (event) {
      var module = app.modules.writing_tools;
      module.functions.select(event.data.field);
    },

    caret_jumped: function () {
      app.modules.writing_tools.functions.cancel_select();
    },

    caret_handle_drag_start: function (event) {
      var module = app.modules.writing_tools;

      var handle = event.data.handle;
      var caret = handle.parent();
      caret.css('border', 'none'); //hide real caret

      var grid = module.functions.create_grid();

      //place the caret ghost
      module.caret_ghost_timer = setInterval(function () {
        var handle_offset = handle.offset();
        var is_right_caret = caret.hasClass('right');
        if (!is_right_caret)
          handle_offset.left += handle.width();

        var grid_target = grid.find_target(handle_offset);

        if (grid_target) {
          if (grid_target.before)
            grid_target.element.before(module.caret_ghost);
          else
            grid_target.element.after(module.caret_ghost);
        }

        if (module.select_mode) {
          if (is_right_caret)
            module.selection = app.modules.util.functions.get_elements_between(module.carets[0], module.caret_ghost);
          else
            module.selection = app.modules.util.functions.get_elements_between(module.caret_ghost, module.carets[1]);
          app.notify({
            type: 'selected'
          });
        }
      }, 50);
    },

    caret_handle_drag_stop: function (event) {
      var module = app.modules.writing_tools;
      clearInterval(module.caret_ghost_timer);

      var handle = event.data.handle;
      var caret = handle.parent();

      if (caret.hasClass('caret') && module.caret_ghost.parent().length == 1) {
        caret.css('border', '');
        module.caret_ghost.after(caret);
        module.caret_ghost.detach();

        // Switch left-right if needed
        var right_caret = $('.right.caret');
        var left_caret = right_caret.nextAll('.caret');
        if (left_caret.length == 1) {
          var left_caret_prev = left_caret.prev();
          right_caret.before(left_caret);
          left_caret_prev.after(right_caret);
        }

        if (module.select_mode) {
          module.selection = app.modules.util.functions.get_elements_between(module.carets[0], module.carets[1]);
          app.notify({
            type: 'selected'
          });
        }
      }
      else {
        // If dragged outside the note-body
        module.carets[0].css('border', '');
        module.carets[1].css('border', '');
        module.caret_ghost.detach();
      }

      handle.css('top', '').css('left', '');
    },

    selected: function () {
      var module = app.modules.writing_tools;
      var selection = module.selection;
      var note_body = app.modules.editor_ui.note_body;
      var note_body_offset = note_body.offset();

      note_body.children('.selection').remove();

      var lines = module.functions.separate_lines(selection);

      // Remove line breaks from lines
      for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].filter(function (element) {
          return !element.hasClass('line-break');
        });
      }

      lines = lines.filter(function (line) {
        return line.length > 0;
      })

      function get_line_bounds(line) {
        var first = line[0];
        var last = line[line.length - 1];

        var first_offset = first.offset();
        var x1 = first_offset.left - note_body_offset.left;
        var x2 = last.offset().left + last.outerWidth(true) - note_body_offset.left;

        var y1 = first_offset.top - note_body_offset.top;
        var y2 = first_offset.top + first.innerHeight() - note_body_offset.top;

        for (var i = 1; i < line.length; i++) {
          var current = line[i];
          var current_offset = current.offset();
          y1 = Math.min(y1, current_offset.top - note_body_offset.top);
          y2 = Math.max(y2, current_offset.top + current.innerHeight() - note_body_offset.top);
        }

        return {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          width: x2 - x1,
          height: y2 - y1
        };
      }

      var line_bounds = [];
      for (var i = 0; i < lines.length; i++)
        line_bounds.push(get_line_bounds(lines[i]));

      for (var i = 0; i < line_bounds.length; i++) {
        var selection_marker = $('<div class="selection"></div>');
        selection_marker.css({
          'left': line_bounds[i].x1 + 'px',
          'top': line_bounds[i].y1 + 'px',
          'width': line_bounds[i].width + 'px',
          'height': line_bounds[i].height + 'px'
        });
        note_body.prepend(selection_marker);
      }

      module.select_mode = true;
    },

    escape_tap: function () {
      app.modules.writing_tools.functions.cancel_select();
    },

    note_title_focus: function () {
      var module = app.modules.writing_tools;
      module.functions.cancel_select();
      module.functions.detach_carets();
    },

    backspace_tap: function () {
      app.modules.writing_tools.functions.remove_selected();
    },

    delete_press: function () {
      app.modules.writing_tools.functions.remove_selected();
    },

    copy: function () {
      var module = app.modules.writing_tools;
      if (module.select_mode) {
        module.clipboard = [];
        for (var i = 0; i < module.selection.length; i++)
          module.clipboard.push(module.selection[i].clone());
      }
    },

    cut: function () {
      app.notify({
        type: 'copy'
      });
      app.modules.writing_tools.functions.remove_selected();
    },

    paste: function () {
      var module = app.modules.writing_tools;
      var caret = module.carets[0];

      if (module.select_mode) {
        module.functions.remove_selected(); // This also creates a restore point
      }
      else {
        app.notify({
          type: 'create_restore_point'
        });
      }

      for (var i = 0; i < module.clipboard.length; i++) {
        var new_element = module.clipboard[i].clone();
        caret.after(new_element);
        new_element.after(caret);
      }
      app.notify({
        type: 'caret_jumped'
      });
    },

    select_all: function () {
      var module = app.modules.writing_tools;
      var note_body = app.modules.editor_ui.note_body;

      note_body.prepend(module.carets[0]);
      note_body.append(module.carets[1]);

      module.selection = note_body.children().not('.caret')
        .toArray().map(function (element) {
          return $(element);
        });

      module.functions.activate_handles();
      app.notify({
        type: 'selected'
      });
    },

    restored_from_history: function () {
      app.modules.writing_tools.carets[0] = $('.caret').first();
    },

    interactive_field_tap: function () {
      app.modules.writing_tools.functions.cancel_select();
    }
  },

  functions: {
    activate_handles: function () {
      var module = app.modules.writing_tools;

      for (var i = 0; i < module.carets.length; i++)
        $.pep.unbind(module.carets[i]);

      $('.caret-handle').pep({
        useCSSTranslation: false,
        shouldEase: false,
        start: function (event) {
          app.notify({
            type: 'caret_handle_drag_start',
            data: {
              handle: $(event.target)
            }
          });
        },

        stop: function (event) {
          app.notify({
            type: 'caret_handle_drag_stop',
            data: {
              handle: $(event.target)
            }
          });
        }
      });

      $('.caret-handle').css('left', '').css('top', '');
    },

    start_selection: function (event) {
      var module = app.modules.writing_tools;
      var note_body = app.modules.editor_ui.note_body;

      var start_offset = {
        left: event.data.event.clientX,
        top: event.data.event.clientY
      };
      var left_caret = module.carets[0];
      var right_caret = module.carets[1];
      var grid = null;
      var grid_target = null;

      note_body.on('mousemove', function (move_event) {
        var offset = {
          left: move_event.clientX,
          top: move_event.clientY
        };

        if (!module.dragging &&
          app.modules.util.functions.dist2(offset, start_offset) > 16
        ) {
          grid = module.functions.create_grid();
          grid_target = grid.find_target(start_offset);

          if (grid_target) {
            if (grid_target.before)
              grid_target.element.before(left_caret);
            else
              grid_target.element.after(left_caret);
          }
          module.dragging = true;
        }

        if (module.dragging) {
          grid_target = grid.find_target(offset);

          if (grid_target) {
            if (grid_target.before)
              grid_target.element.before(right_caret);
            else
              grid_target.element.after(right_caret);

            module.selection = app.modules.util.functions.get_elements_between(left_caret, right_caret);
            module.functions.activate_handles();
            app.notify({
              type: 'selected'
            });
          }
        }
      });
    },

    select: function (target) {
      var module = app.modules.writing_tools;
      var blocking_classes = /complex-field|margin-field|punctuation|space|line-break/;
      var get_close = app.modules.util.functions.get_close_elements;

      var selected = get_close(target, 'left', blocking_classes, /caret/).reverse();
      selected.push(target);
      selected = selected.concat(get_close(target, 'right', blocking_classes, /caret/));

      selected[0].before(module.carets[0]);
      selected[selected.length - 1].after(module.carets[1]);

      module.selection = selected;
      module.functions.activate_handles();
      app.notify({
        type: 'selected'
      });
    },

    cancel_select: function () {
      var module = app.modules.writing_tools;
      var note_body = app.modules.editor_ui.note_body;
      if (module.select_mode) {
        module.carets[1].detach();
        note_body.children('.selection').remove();
        module.selection = null;
        module.select_mode = false;
      }
      module.functions.activate_handles();
    },

    detach_carets: function () {
      var module = app.modules.writing_tools;
      for (var i = 0; i < module.carets.length; i++)
        module.carets[i].detach();
    },

    separate_lines: function (elements) {
      if (!elements) {
        elements = app.modules.editor_ui
          .note_body.children();
      }

      var threshold = 5;
      var x1 = null,
        x2 = null;
      var current_line = [];
      var lines = [];

      function add_line() {
        lines.push(current_line);
        current_line = [];
      }

      for (var i = 0; i < elements.length; i++) {
        var child = $(elements[i]);

        if (child.hasClass('line-break')) {
          current_line.push(child);
          x2 = null;
          add_line();
        }
        else {
          x1 = child.offset().left;
          if (x2 != null && x2 - x1 > threshold) {
            add_line();
          }
          x2 = x1 + child.innerWidth();
          current_line.push(child);
        }
      }

      if (current_line.length > 0) {
        lines.push(current_line);
      }

      return lines;
    },

    find_line_ends: function (elements) {
      var module = app.modules.writing_tools;
      var lines = module.functions.separate_lines(elements);
      var ends = [];

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        ends.push(line[line.length - 1]);
      }

      return ends;
    },

    create_grid: function () {
      var module = app.modules.writing_tools;
      var note_body = app.modules.editor_ui.note_body;

      var fields_jq = note_body
        .children('.simple-field, .complex-field')
        .not('br, .radial-c > *');

      if (fields_jq.length == 0) {
        return { // If there are no fields, there is no target as well
          find_target: function () {
            return null;
          }
        };
      }

      var fields = [];
      fields_jq.each(function () {
        var target = $(this);
        var target_offset = target.offset();
        target_offset.top += target.height() / 2;
        fields.push({
          element: target,
          start: {
            top: target_offset.top,
            left: target_offset.left
          },
          end: {
            top: target_offset.top,
            left: target_offset.left + target.outerWidth(true)
          }
        });
      });

      var min_offset = {
        top: fields[0].start.top,
        left: fields[0].start.left
      };
      var elements = [
        [
          []
        ]
      ]; //3-dimensional array
      var cell_size = 100;

      function get_coord(offset) {
        var coord = {
          top: Math.max(0, Math.floor((offset.top - min_offset.top) / cell_size)),
          left: Math.max(0, Math.floor((offset.left - min_offset.left) / cell_size))
        }
        return coord;
      }

      function add_element(element, offset, is_start) {
        var field = {
          element: element,
          offset: offset,
          is_start: is_start
        }
        var coord = get_coord(field.offset);

        //stretch the grid if necessary
        if (coord.top > elements.length - 1)
          for (var j = elements.length - 1; j < coord.top; j++)
            elements.push([
              []
            ]);

        if (coord.left > elements[coord.top].length - 1)
          for (var j = elements[coord.top].length - 1; j < coord.left; j++)
            elements[coord.top].push([]);

        //add the element to the grid
        elements[coord.top][coord.left].push(field);
      }

      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        add_element(field.element, field.start, true);
        add_element(field.element, field.end, false);
      }

      function find_target(offset) {
        var min_dist = null;
        var closest_target = null;
        var before = null;

        var coord = get_coord(offset);
        coord.top = Math.min(coord.top, elements.length - 1);
        coord.left = Math.min(coord.left, elements[coord.top].length - 1);
        var cell = elements[coord.top][coord.left];

        if (cell.length > 0) {
          for (var i = 0; i < cell.length; i++) {
            var target = cell[i].element;
            var target_offset = cell[i].offset;

            var top_dif = offset.top - target_offset.top;
            var left_dif = offset.left - target_offset.left;

            var dist = top_dif * top_dif + left_dif * left_dif;
            if (min_dist == null || dist < min_dist) {
              min_dist = dist;
              closest_target = target;
              before = cell[i].is_start;
            }
          }
        }

        if (closest_target) {
          return {
            element: closest_target,
            before: before
          }
        }
        else {
          return null;
        }
      }

      var result = {
        cell_size: cell_size,
        elements: elements,
        get_coord: get_coord,
        find_target: find_target
      };

      return result;
    },

    remove_selected: function () {
      var module = app.modules.writing_tools;
      if (module.select_mode) {
        var selection = module.selection;
        module.functions.cancel_select();
        if (selection.length > 0) {
          app.notify({
            type: 'create_restore_point'
          });
          for (var i = 0; i < selection.length; i++)
            selection[i].remove();
        }
      }
    }
  }
}
