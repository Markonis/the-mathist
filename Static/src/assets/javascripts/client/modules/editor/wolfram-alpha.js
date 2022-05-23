/* global app $ */

app.modules.wolfram_alpha = {
  init: function () {
    var module = app.modules.wolfram_alpha;
    var editor = app.modules.editor;
    var expressions = editor.expression_templates;

    module.simple_conversions = {
      "=": expressions.algebra["Equal"],
      "~~": expressions.algebra["Similar or equal"],
      "!=": expressions.algebra["Not equal"],
      ">": expressions.algebra["Greater than"],
      ">=": expressions.algebra["Greater or equal"],
      "<": expressions.algebra["Less than"],
      "<=": expressions.algebra["Less or equal"],
      "+": expressions.algebra["Plus"],
      "±": expressions.algebra["Plus-minus"],
      "-": expressions.algebra["Minus"],
      "∓": expressions.algebra["Minus-plus"],
      "*": expressions.algebra["Times"],
      "infinity": expressions.calculus["Infinity"],
      "element": expressions.sets["Element"],
      "pi": expressions.greek['pi'],
      " ": expressions.punctuation["Space"],
      "\n": expressions.punctuation['Line break']
    };

    module.inverse_character_conversions = {
      "π": "pi",
      "Σ": "sum",
      "Π": "product",
      "∫": "integral",
      "×": " "
    };

    module.choose_results_dialog = $('#choose-results-dialog');
    module.choose_results_dialog.on('tap', '.btn-list .btn', function () {
      app.notify({
        type: 'computation_result_chosen',
        data: {
          button: $(this)
        }
      });
    });

    module.repeater = app.modules.util.functions.create_repeater($('#computation-result-template'), []);
    app.notify({
      type: 'module_ready',
      data: {
        name: 'wolfram_alpha'
      }
    });
  },

  functions: {
    parse_math: function (math) {
      var module = app.modules.wolfram_alpha;
      try {
        return module.parser.parse(math.trim());
      }
      catch (e) {
        console.log('Could not parse math: ' + math);
        return [];
      }
    },

    write_math: function (math) {
      var module = app.modules.wolfram_alpha;
      var chunk_separator = /,? {2,}/;
      $.each(math.split(chunk_separator), function (index, chunk) {
        var parsed = module.functions.parse_math(chunk);
        module.functions.write_math_chunk(parsed);
      });
    },

    write_math_chunk: function (expressions) {
      var module = app.modules.wolfram_alpha;
      var editor = app.modules.editor;
      var simple_conversions = module.simple_conversions;
      var selection = app.modules.writing_tools.selection;

      function write_element(element) {
        element.addClass('wa');
        editor.functions.write_element(element);
      }

      function move_right() {
        app.notify({
          type: 'move_caret',
          data: {
            direction: 'right',
            reason: 'moving'
          }
        });
      }

      function write_expressions(list, depth) {
        $.each(list, function (index, expression) {
          write_expression(expression, depth)
        });
      }

      function write_expression(expression, depth) {
        switch (expression.type) {
        case "simple":
          write_simple(expression);
          break;
        case "word":
          write_word(expression, depth);
          break;
        case "matrix":
          write_matrix(expression, depth);
          break;
        case "brackets":
          write_brackets(expression, depth);
          break;
        case "fraction":
          write_fraction(expression, depth);
          break;
        case "sqrt":
          write_sqrt(expression, depth);
          break;
        case "radial":
          write_radial(expression, depth);
          break;
        case "log":
          write_log(expression, depth);
          break;
        case "trigonometric":
          write_trigonometric(expression, depth);
          break;
        }
      }

      function write_simple(element) {
        if (simple_conversions.hasOwnProperty(element.text)) {
          write_element(simple_conversions[element.text].clone());
        }
        else {
          var simple = $('<div class="simple-field">' + element.text + '</div>');
          write_element(simple);
        }
      }

      function write_word(element, depth) {
        var text = element.text;
        var i = 0;

        if (simple_conversions.hasOwnProperty(text)) {
          var template = simple_conversions[text];
          write_element(template.clone());
        }
        else {
          if (depth == 0) {
            var word = $('<div class="complex-field word"></div>');
            var field = $('<div class="crucial pass-through field"></div>');
            var simple_field = $('<div class="simple-field"></div>');
            for (i = 0; i < text.length; i++) {
              field.append(simple_field.clone().text(text[i]));
            }
            word.append(field);
            write_element(word);
            for (i = 0; i < text.length - 1; i++) {
              move_right();
            }
          }
          else {
            var simples = text.split('');
            for (i = 0; i < simples.length; i++) {
              write_simple({
                text: simples[i]
              });
            }
          }
        }
      }

      function write_matrix(element, depth) {
        var caret = app.modules.writing_tools.carets[0];

        function adjust_size(matrix, width, height) {
          // Get it down to 1x1
          matrix.find('tr').last().remove();
          matrix.find('td').last().remove();

          var i = 0;
          var td = matrix.find('td');
          for (i = 0; i < width - 1; i++) {
            td.after(td.clone());
          }

          var tr = matrix.find('tr');
          for (i = 0; i < height - 1; i++) {
            tr.after(tr.clone());
          }
        }

        function write_row(row) {
          for (var i = 0; i < row.cells.length; i++) {
            var cell = row.cells[i];
            write_expressions(cell.expressions, depth + 1);
            move_right();
          }
        }

        function write_rows(rows) {
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            editor.functions.jump(caret.siblings().first());
            write_row(row);
          }
        }

        var matrix = editor.expression_templates.algebra["Matrix"].clone();
        adjust_size(matrix, element.rows[0].cells.length, element.rows.length);

        write_element(matrix);
        write_rows(element.rows);
        move_right();
      }

      function write_brackets(element, depth) {
        var brackets_templates = {
          'round': editor.expression_templates.brackets['Round brackets'],
          'square': editor.expression_templates.brackets['Square brackets'],
          'curly': editor.expression_templates.brackets['Curly brackets']
        };
        write_element(brackets_templates[element.subtype].clone());
        write_expressions(element.expressions, depth + 1);
        move_right();
      }

      function write_fraction(element, depth) {
        var template = editor.expression_templates.algebra['Fraction'];
        write_element(template.clone());
        write_expression(element.upper, depth + 1);
        move_right();
        write_expression(element.lower, depth + 1);
        move_right();
      }

      function write_sqrt(element, depth) {
        var template = editor.expression_templates.algebra['Root'];
        write_element(template.clone());
        move_right();
        write_expressions(element.expression, depth + 1);
        move_right();
      }

      function write_radial(element, depth) {
        function strip_brackets(e) {
          if (e.type == 'brackets') {
            return e.expressions;
          }
          else {
            return e;
          }
        }

        var writers = {
          regular: function () {
            write_expression(element.c);
            if (element.tr) {
              app.notify({
                type: "radial_field_tap",
                data: {
                  radial_class: 'radial-tr'
                }
              });
              write_expression(element.tr, depth + 1);
              move_right();
            }
            if (element.br) {
              app.notify({
                type: "radial_field_tap",
                data: {
                  radial_class: 'radial-br'
                }
              });
              write_expression(element.br, depth + 1);
              move_right();
            }
          },

          integral: function () {
            var template = editor.expression_templates.calculus['Integral'];
            write_element(template.clone());
            if (element.br) {
              write_expression(element.br, depth + 1);
            }
            move_right();
            if (element.tr) {
              write_expression(element.tr, depth + 1);
            }
            move_right();
          },

          product: function () {
            var template = editor.expression_templates.algebra['Product'];
            write_element(template.clone());
            if (element.br) {
              write_expression(element.br, depth + 1);
            }
            move_right();
            if (element.tr) {
              write_expression(element.tr, depth + 1);
            }
            move_right();
          },

          summation: function () {
            var template = editor.expression_templates.algebra['Summation'];
            write_element(template.clone());
            if (element.br) {
              write_expression(element.br, depth + 1);
            }
            move_right();
            if (element.tr) {
              write_expression(element.tr, depth + 1);
            }
            move_right();
          }
        };

        writers[element.subtype]();
      }

      function write_log(element, depth) {
        var template = editor.expression_templates.algebra['Logarithm'];
        var brackets_template = editor.expression_templates.brackets['Round brackets'];
        write_element(template.clone());
        if (element.base) {
          write_expressions(element.base, depth + 1);
        }
        move_right();
        write_element(brackets_template.clone());
        write_expressions(element.expressions, depth + 1);
        move_right();
      }

      function write_trigonometric(element, dept) {
        var templates = {
          "sin": editor.expression_templates.trigonometry["Sine"],
          "cos": editor.expression_templates.trigonometry["Cosine"],
          "tan": editor.expression_templates.trigonometry["Tangent"]
        };
        write_element(templates[element.subtype].clone());
        write_expression(element.expression);
      }

      if (selection != null)
        app.notify({
          type: 'field_tap',
          data: {
            field: selection[selection.length - 1]
          }
        });

      app.notify({
        type: 'add_new_line'
      });

      write_expressions(expressions, 0);
    },

    write_image: function (src) {
      var editor = app.modules.editor;
      var manipulator = app.modules.manipulator;
      var selection = app.modules.writing_tools.selection;

      if (selection != null)
        app.notify({
          type: 'field_tap',
          data: {
            field: selection[selection.length - 1]
          }
        });
      app.notify({
        type: 'add_new_line'
      });

      var image = $('<img>').attr('src', src);
      var simple_field = $('<div class="simple-field v-centered"></div>');
      simple_field.append(image);
      manipulator.functions.append_to(simple_field);

      editor.functions.write_element(simple_field);
    },

    convert_to_mathematica: function (container) {
      var module = app.modules.wolfram_alpha;
      var math = "";

      function process_radial(element) {
        var c = element.children('.radial-c');
        var c_conv = convert_element(c).math;
        if (module.inverse_character_conversions.hasOwnProperty(c_conv)) {
          c_conv = module.inverse_character_conversions[c_conv];
        }

        var exp = element.children('.radial-tr');
        var exp_conv = convert_element(exp).math;
        exp_conv = exp_conv == "" ? convert_element(element.children('.radial-t')).math : exp_conv;

        var ind = element.children('.radial-br');
        var ind_conv = convert_element(ind).math;
        ind_conv = ind_conv == "" ? convert_element(element.children('.radial-b')).math : ind_conv;

        var res = {
          c: c,
          c_conv: c_conv,
          exp: exp,
          exp_conv: exp_conv,
          ind: ind,
          ind_conv: ind_conv
        };

        return res;
      }

      function convert_element(element) {
        var res = "";
        var skip_forward = 0;
        //the not supported
        if (element.hasClass('limit')) {
          throw "We are sorry, limits are not yet supported";
        }

        if (element.hasClass('word')) {
          res += convert_element(element.children('.field').first()).math;
        }
        if (element.hasClass('field')) {
          element.children().each(function () {
            res += convert_element($(this)).math;
          });
        }
        else if (element.hasClass('simple-field')) {
          if (element.hasClass('space') || element.hasClass('line-break')) {
            res += ' ';
          }
          else {
            res += element.text();
          }
        }
        else if (element.hasClass('fraction')) {
          var children = element.children();
          res += "((" + convert_element(children.first()).math + ")/(" + convert_element(children.last()).math + "))";
        }
        else if (element.hasClass('logarithm')) {
          var e = process_radial(element);
          res += " (log(" + (e.ind_conv != "" ? e.ind_conv + ", " : "") + convert_element(element.next()).math + "))" + (e.exp_conv != "" ? "^(" + e.exp_conv + ")" : "");
          skip_forward = 1;
        }
        else if (element.hasClass('radial')) {
          var e = process_radial(element);
          var c_child = e.c.children().first();

          if (c_child.hasClass('trigonometric')) {
            res += "(" + e.c_conv + convert_element(element.next()).math + ")" + (e.exp_conv != "" ? "^(" + e.exp_conv + ")" : "");
            skip_forward = 1;
          }
          else {
            res += " " + e.c_conv + (e.ind_conv != "" ? "_(" + e.ind_conv + ")" : "") + (e.exp_conv != "" ? "^(" + e.exp_conv + ")" : "") + " ";
          }

        }
        else if (element.hasClass('root')) {
          var exp = convert_element(element.children('.field').first()).math;
          var value = convert_element(element.children('.field').last()).math;

          if (exp == "") {
            exp = 2;
          }
          res += "(" + value + ")^" + "(1/(" + exp + "))";
        }
        else if (element.hasClass('matrix')) {
          res += "{";
          var j = 0;
          element.children('tbody').children('tr').each(function () {
            var $row = $(this);
            if (j > 0) res += ', ';
            res += "{";
            var i = 0;
            $row.children().each(function () {
              var $cell = $(this);
              if (i > 0) res += ', ';
              res += convert_element($cell).math;
              i++;
            });
            res += "}";
            j++;
          });
          res += "}";
        }
        else if (element.hasClass('brackets')) {
          var field = element.children('.field').first();
          var field_children = field.children();
          if (field_children.length == 1 && field_children.first().hasClass('matrix')) {
            res += convert_element(field_children.first()).math;
          }
          else {
            res += "(" + convert_element(field).math + ")";
          }
        }

        return {
          math: res,
          skip: skip_forward
        };
      }

      var skip = 0;
      container.children().each(function () {
        if (skip == 0) {
          var res = convert_element($(this));
          math += res.math;
          skip += res.skip;
        }
        else {
          skip--;
        }
      });

      return math;
    },

    process_computation_response: function (response) {
      var module = app.modules.wolfram_alpha;
      var results = [];

      var xml = $($.parseXML(response.data));
      xml.find('pod').each(function () {
        var pod = $(this);
        var title = pod.attr('title');
        var data = [];
        $(this).children('subpod').each(function () {
          var subpod = $(this);
          var text = subpod.children('plaintext').first().text();
          var image = subpod.children('img');
          var subtitle = subpod.attr('title');
          if (!text || text.length == 0) {
            data.push({
              type: 'image',
              src: image.attr('src'),
              height: image.attr('height')
            });
          }
          else {
            if (subtitle && subtitle.length > 0) {
              text = subtitle + ':\n' + text;
            }
            data.push({
              type: 'formula',
              math: text
            });
          }
        });

        results.push({
          title: title,
          data: data
        });
      });

      for (var i = 0; i < results.length; i++) {
        results[i].data = JSON.stringify(results[i].data);
      }

      module.repeater.update(results);
    }
  },

  actions: {
    compute_tap: function () {
      var module = app.modules.wolfram_alpha;
      if (!app.modules.writing_tools.select_mode) return;

      // Open wait dialog
      app.notify({
        type: "open_dialog_tap",
        data: {
          dialog: $('#compute-wait-dialog')
        }
      });

      try {
        // Convert selected items to math
        var selection = app.modules.writing_tools.selection;
        var temp = $('<div></div>');
        for (var i = 0; i < selection.length; i++) {
          temp.append(selection[i].clone());
        }
        var math = module.functions.convert_to_mathematica(temp);

        $.ajax({
          type: "POST",
          url: "/client/calculate",
          data: JSON.stringify({
            wolfram: encodeURIComponent(math)
          }),
          success: function (response) {
            if (response.status) {
              module.functions.process_computation_response(response);
            }
            else {
              app.modules.notifications.functions.show(response.data.message, "cross");
            }

            // Close wait dialog
            app.notify({
              type: 'close_dialog_tap'
            });

            // Open results dialog
            app.notify({
              type: 'open_dialog_tap',
              data: {
                dialog: module.choose_results_dialog
              }
            });
          }
        });
      }
      catch (err) {
        // Close wait dialog
        app.notify({
          type: 'close_dialog_tap'
        });

        // Show error dialog
        app.modules.notifications.functions.show(err, "cross");
      }
    },

    computation_result_chosen: function (event) {
      var module = app.modules.wolfram_alpha;
      var editor = app.modules.editor;

      var button = event.data.button;
      var result_data = JSON.parse(button.children('span').last().text());
      if (button.siblings().length == 0) {
        app.notify({
          type: 'close_dialog_tap'
        });
      }
      else {
        button.remove();
      }

      for (var i = 0; i < result_data.length; i++) {
        if (result_data[i].type == "formula") {
          module.functions.write_math(result_data[i].math);
        }
        else {
          var src = result_data[i].src;
          if (src[0] == '"') src = src.substring(1, src.length - 1);
          module.functions.write_image(src);
        }
      }
    },

    file_saved: function () {
      app.modules.editor_ui.note_body.find('img.simple-field').each(function () {
        var image = $(this);
        var image_url = image.attr('src');

        if (image_url.indexOf("wolframalpha.com") > -1) {
          $.ajax({
            type: 'POST',
            url: 'client/images/download',
            data: JSON.stringify({
              url: image_url
            }),
            success: function (response) {
              console.log(response);
              if (response.status) {
                image.attr('src', 'data:image/gif;base64,' + response.data.image_data);
              }
            }
          });
        }
      });
    }
  }
};
