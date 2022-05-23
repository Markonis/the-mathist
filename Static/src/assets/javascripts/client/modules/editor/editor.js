/* global app $ */

app.modules.editor = {

  init: function () {
    var module = app.modules.editor;
    module.radial_template = $('#radial-template').detach();
    module.formula_mode = false;
    module.textarea = $('#focus-textarea');
    module.em_measure = $('<div style="height: 1em; position: fixed;"></div>');
    //all expressions
    module.expression_templates = {
      'punctuation': {
        "Space": $('<div class="simple-field space"></div>'),
        "Line break": $('<br class="simple-field line-break"/>'),
        "Comma": $('<div class="punctuation simple-field">,</div>'),
        "Full stop": $('<div class="punctuation simple-field">.</div>'),
        "Question mark": $('<div class="punctuation simple-field">?</div>'),
        "Colon": $('<div class="punctuation simple-field">:</div>'),
        "Semicolon": $('<div class="punctuation simple-field">;</div>'),
        "Overline": $('<div class="overline word complex-field"><div class="crucial field new-field pass-through">a</div></div>"'),
        "Underline": $('<div class="underline word complex-field"><div class="crucial field new-field pass-through">a</div></div>"'),
        "Right arrow": $('<div class="punctuation simple-field">→</div>')
      },

      'brackets': {
        "Round brackets": $('<div class="complex-field round brackets"><div class="left stretched">(</div><div class="pass-through crucial field new-field"></div><div class="right stretched">)</div></div>'),
        "Straight brackets": $('<div class="complex-field straight brackets"><div class="left"></div><div class="pass-through field crucial new-field"></div><div class="right"></div></div>'),
        "Square brackets": $('<div class="complex-field square brackets"><div class="left"></div><div class="pass-through field crucial new-field"></div><div class="right square"></div></div>'),
        "Curly brackets": $('<div class="complex-field curly brackets"><div class="left stretched">{</div><div class="pass-through crucial field new-field"></div><div class="right stretched">}</div></div>'),
        "Angle brackets": $('<div class="complex-field angle brackets"><div class="left stretched">〈</div><div class="pass-through crucial field new-field"></div><div class="right stretched">〉</div></div>')
      },

      'algebra': {
        "Fraction": $('<div class="complex-field two-storey margin-field fraction"><div class="field pass-through new-field">x</div><div class="aligner"></div><div class="field pass-through new-field">y</div></div>'),
        "Root": $('<div class="complex-field margin-field root"><div class="pass-through field new-field exp">x</div><div class="stretched radix">√</div><div class="pass-through field new-field inner">x</div></div>'),
        "Matrix": $('<div class="complex-field square brackets"><div class="left"></div><div class="crucial field"><table class="complex-field margin-field matrix"><tbody class="forbidden field"><tr class="complex-field"><td class="pass-through new-field field">a</td><td class="pass-through new-field field">b</td></tr><tr class="complex-field"><td class="pass-through new-field field">c</td><td class="pass-through new-field field">d</td></tr></tbody></table></div><div class="right"></div></div>'),
        "Summation": $('<div class="complex-field summation two-storey">' +
          '<div class="field pass-through new-field" order="2">m</div>' +
          '<div class="field aligner"><div class="simple-field">Σ</div></div>' +
          '<div class="field pass-through new-field crucial" order="1">n</div>' +
          '</div>'),

        "Product": $('<div class="complex-field product two-storey">' +
          '<div class="field pass-through new-field" order="2">m</div>' +
          '<div class="field aligner"><div class="simple-field">∏</div></div>' +
          '<div class="field pass-through new-field crucial" order="1">n</div>' +
          '</div>'),

        "Logarithm": $('<div class="complex-field margin-field logarithm two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr"></div>' +
          '<div class="field aligner radial-c"><div class="simple-field">log</div></div>' +
          '<div class="field radial-br pass-through new-field">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Vector": $('<div class="complex-field text-centered vector">' +
          '<div class="inline horizontally-stretched">→</div><br>' +
          '<div class="field pass-through crucial new-field">a</div>' +
          '</div>'),

        "Equal": $('<div class="simple-field operator wide margin-field">=</div>'),
        "Not equal": $('<div class="simple-field operator wide margin-field">≠</div>'),
        "Similar": $('<div class="simple-field operator wide margin-field">∼</div>'),
        "Not similar": $('<div class="simple-field operator wide margin-field">≁</div>'),
        "Similar or equal": $('<div class="simple-field operator wide margin-field">≃</div>'),
        "Not similar or equal": $('<div class="simple-field operator wide margin-field">≄</div>'),
        "Congruent": $('<div class="simple-field operator wide margin-field">≅</div>'),
        "Not congruent": $('<div class="simple-field operator wide margin-field">≆</div>'),
        "Greater than": $('<div class="simple-field operator wide margin-field">></div>'),
        "Less than": $('<div class="simple-field operator wide margin-field"><</div>'),
        "Much greater than": $('<div class="simple-field operator wide margin-field">≫</div>'),
        "Much less than": $('<div class="simple-field operator wide margin-field">≪</div>'),
        "Greater or equal": $('<div class="simple-field operator wide margin-field">≥</div>'),
        "Less or equal": $('<div class="simple-field operator wide margin-field">≤</div>'),
        "Equivalent": $('<div class="simple-field operator wide margin-field">≡</div>'),
        "Plus": $('<div class="simple-field operator margin-field">+</div>'),
        "Plus-minus": $('<div class="simple-field operator margin-field">±</div>'),
        "Minus": $('<div class="simple-field operator margin-field">-</div>'),
        "Minus-plus": $('<div class="simple-field operator margin-field">∓</div>'),
        "Times": $('<div class="simple-field operator margin-field">×</div>'),
        "Dot": $('<div class="simple-field operator margin-field">⋅</div>'),
        "Proportional": $('<div class="simple-field operator margin-field">∝</div>'),
        "Percent": $('<div class="simple-field operator">%</div>'),
        "Divides": $('<div class="simple-field operator">∣</div>'),
        "Does not divide": $('<div class="simple-field operator">∤</div>')
      },

      'logic': {
        "Not": $('<div class="simple-field logic">¬</div>'),
        "And": $('<div class="simple-field logic margin-field">∧</div>'),
        "Or": $('<div class="simple-field logic margin-field">∨</div>'),
        "Exclusive or": $('<div class="simple-field logic margin-field">⊻</div>'),
        "Implication": $('<div class="simple-field logic wide margin-field">⇒</div>'),
        "Equivalence": $('<div class="simple-field logic wide margin-field">⇔</div>'),
        "Therefore": $('<div class="simple-field logic wide margin-field">∴</div>'),
        "Because": $('<div class="simple-field logic wide margin-field">∵</div>'),
        "For all": $('<div class="simple-field logic">∀</div>'),
        "Exists": $('<div class="simple-field logic">∃</div>'),
        "Does not exist": $('<div class="simple-field logic">∄</div>'),
        "True": $('<div class="simple-field logic">⊤</div>'),
        "False": $('<div class="simple-field logic">⊥</div>'),
        "Provable": $('<div class="simple-field logic margin-field">⊢</div>')
      },

      'sets': {
        "Subset": $('<div class="simple-field sets">⊂</div>'),
        "Superset": $('<div class="simple-field sets">⊃</div>'),
        "Subset or equal": $('<div class="simple-field sets">⊆</div>'),
        "Superset or equal": $('<div class="simple-field sets">⊇</div>'),
        "Intersection": $('<div class="simple-field sets">∩</div>'),
        "Union": $('<div class="simple-field sets">∪</div>'),
        "Member": $('<div class="simple-field sets margin-field">∈</div>'),
        "Not member": $('<div class="simple-field sets margin-field">∉</div>'),
        "Empty set": $('<div class="simple-field sets margin-field">∅</div>')
      },

      'trigonometry': {
        "Sine": $('<div class="trigonometric simple-field">sin</div>'),
        "Arcus sine": $('<div class="trigonometric simple-field">arcsin</div>'),
        "Cosine": $('<div class="trigonometric simple-field">cos</div>'),
        "Arcus cosine": $('<div class="trigonometric simple-field">arccos</div>'),
        "Tangent": $('<div class="trigonometric simple-field">tan</div>'),
        "Arcus tangent": $('<div class="trigonometric simple-field">arctan</div>'),
        "Cotangent": $('<div class="trigonometric simple-field">cotan</div>'),
        "Arcus cotangent": $('<div class="trigonometric simple-field">arccotan</div>')
      },

      'calculus': {
        "Integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∫</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Double integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∬</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Tripple integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∭</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Closed contour integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∮</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Closed surface integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∯</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Closed volume integral": $('<div class="complex-field integral two-storey radial">' +
          '<div class="field radial-t"></div>' +
          '<div class="field radial-tr pass-through new-field" order="2">b</div>' +
          '<div class="field aligner radial-c"><div class="simple-field">∰</div></div>' +
          '<div class="field radial-br pass-through new-field" order="1">a</div>' +
          '<div class="field radial-b"></div>' +
          '</div>'),

        "Limit": $('<div class="complex-field margin-field limit two-storey">' +
          '<div class="field aligner"><div class="simple-field">lim</div></div>' +
          '<div class="complex-field">' +
          '<div class="field pass-through new-field">n→m</div>' +
          '</div>' +
          '</div>'),

        "Infinity": $('<div class="simple-field calculus">∞</div>'),
        "Derivative": $('<div class="simple-field calculus">\'</div>'),
        "Partial derivative": $('<div class="simple-field calculus">∂</div>'),
        "Nabla": $('<div class="simple-field calculus">∇</div>')
      },

      'greek': {}
    };

    var greek = {
      'alpha': 'α',
      'beta': 'β',
      'gamma': 'γ',
      'delta': 'δ',
      'epsilon': 'ε',
      'zeta': 'ζ',
      'eta': 'η',
      'theta': 'θ',
      'iota': 'ι',
      'kappa': 'κ',
      'lambda': 'λ',
      'mu': 'μ',
      'nu': 'ν',
      'xi': 'ξ',
      'omicron': 'ο',
      'pi': 'π',
      'rho': 'ρ',
      'sigma': 'σ',
      'tau': 'τ',
      'upsilon': 'υ',
      'phi': 'φ',
      'chi': 'χ',
      'psi': 'ψ',
      'omega': 'ω'
    };

    $.each(greek, function (name, glyph) {
      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      module.expression_templates['greek'][name] = $('<div class="simple-field">' + glyph + '</div>');
      module.expression_templates['greek'][capitalize(name)] = $('<div class="simple-field">' + glyph.toUpperCase() + '</div>');
    });

    app.notify({
      type: "module_ready",
      data: {
        name: "editor"
      }
    });
  },

  actions: {
    add_new_line: function () {
      var module = app.modules.editor;
      var caret = app.modules.writing_tools.carets[0];
      var caret_parent = caret.parent();
      if (caret_parent.is('td')) {
        module.functions.add_matrix_row(caret_parent.parent());
      }
      else {
        module.functions.write_element(
          module.expression_templates.punctuation['Line break'].clone());
      }
    },

    note_title_focus: function (event) {
      var module = app.modules.editor;
      module.formula_mode = false;
    },

    open_dialog_tap: function (event) {
      var module = app.modules.editor;
      module.formula_mode = false;
    },

    home_tap: function (event) {
      var module = app.modules.editor;
      module.formula_mode = false;
    },

    note_title_blur_press: function (event) {
      var module = app.modules.editor;
      module.functions.jump(app.modules.editor_ui.note_body, true);
      module.functions.focus();
    },

    field_tap: function (event) {
      var module = app.modules.editor;
      module.functions.jump(event.data.field);
      module.functions.focus();
    },

    interactive_field_tap: function (event) {
      var module = app.modules.editor;
      module.formula_mode = false;
    },

    math_container_tap: function (event) {
      var module = app.modules.editor;
      var writing_tools = app.modules.writing_tools;
      var line_ends = writing_tools.functions.find_line_ends();
      var dist = null,
        min_dist = null;
      var chosen = null;
      var offset = null;
      for (var i = 0; i < line_ends.length; i++) {
        offset = line_ends[i].offset().top + line_ends[i].height() / 2;
        dist = Math.abs(offset - event.data.y);
        if (i == 0 || dist < min_dist) {
          min_dist = dist;
          chosen = line_ends[i];
        }
      }
      if (chosen) {
        module.functions.jump(chosen, chosen.hasClass('line-break'));
        module.functions.focus();
      }
      else {
        app.notify({
          type: 'field_tap',
          data: {
            field: $('#note-body')
          }
        });
      }
    },

    key_tap: function (event) {
      var module = app.modules.editor;
      if (module.formula_mode && event.data) {
        var expression_path = event.data.key.attr('expression');
        if (expression_path === undefined) {
          module.functions.write_element(event.data.key.children().first().clone()); //the inside of the key
        }
        else {
          var key = event.data.key;
          var cached_group = key.data('group');
          if (cached_group === undefined) {
            module.functions.write_element(
              module.functions.parse_expression(expression_path)[0].clone()
            );
          }
          else {
            module.functions.write_element(cached_group[0].clone());
          }
        }
      }
    },

    radial_field_tap: function (event) {
      var module = app.modules.editor;
      var caret = app.modules.writing_tools.carets[0];
      var caret_prev = caret.prev();

      function simple_fields_radial() {
        var prev = [];

        if (event.data.radial_class == 'radial-tr') {
          // We can only put exponent on a number or a single letter
          prev = module.functions.get_prev({
            only: /number|punctuation/
          });
          if (prev.length == 0 && !caret_prev.attr('class').match(/complex-field|margin-field|space|punctuation|number|line-break/)) {
            prev.push(caret_prev);
          }
        }
        else {
          prev = module.functions.get_prev({
            until: /complex-field|margin-field|space|punctuation|line-break/
          });
        }

        if (prev.length > 0) {
          for (var i = 0; i < prev.length; i++) {
            radial_element.children('.radial-c').append(prev[i]);
          }

          module.functions.insert_element(radial_element);
          next_field = radial_element.children('.' + event.data.radial_class);
        }
      }

      if (caret_prev.length > 0) {
        var next_field = null;
        var radial_element = null;

        if (!caret_prev.hasClass('radial')) {
          // Create a new radial
          radial_element = module.radial_template.clone().removeAttr("id");

          if (caret_prev.hasClass('simple-field')) {
            simple_fields_radial();

          }
          else if (caret_prev.hasClass('word')) {
            // Jump into word and then create radial from simple fields
            caret_prev.children().first().append(caret);
            caret_prev = caret.prev();
            simple_fields_radial();

          }
          else if (caret_prev.hasClass('brackets')) {
            // Just add the brackets to radial
            radial_element.children('.radial-c').append(caret_prev);
            module.functions.insert_element(radial_element);
            next_field = radial_element.children('.' + event.data.radial_class);

          }
          else {
            // first add brackets around the complex element (fraction, root,..)
            var brackets = module.expression_templates.brackets["Round brackets"].clone();
            brackets.children('.field').removeClass('new-field').append(caret_prev);
            radial_element.children('.radial-c').append(brackets).addClass('forbidden');
            module.functions.insert_element(radial_element);
            module.functions.format(brackets);
            next_field = radial_element.children('.' + event.data.radial_class);
          }
        }
        else {
          //just jump to the existing radial field
          radial_element = caret_prev;
          next_field = caret_prev.children('.' + event.data.radial_class);
        }

        if (next_field) {
          next_field.addClass('pass-through');
          module.functions.format_out(radial_element);
          module.functions.jump(next_field);
        }
      }
    },

    move_caret: function (event) {
      var module = app.modules.editor;

      function walk_caret(math_container) {
        var caret_parent = caret.parent();
        var caret_grandparent = caret_parent.parent();
        var next_field = null;
        var continue_walking = false;
        var before = true;

        if (dir == "up") {
          if (caret_grandparent.hasClass('fraction')) {
            module.functions.jump(caret_grandparent.children().first());
          }
          else if (caret_grandparent.hasClass('root')) {
            module.functions.jump(caret_grandparent.children('.exp'));
          }
          else if (caret_parent.is('td')) {
            var prev_row = caret_grandparent.prev();
            var index = caret_parent.index();
            if (prev_row.length > 0) {
              module.functions.jump(prev_row.children().eq(index));
            }
          }
          else {
            var line = module.functions.find_offset_line(-1);
            if (line && line.length > 0) {
              var jump_target = module.functions.find_aligned_jump_target(line);
              module.functions.jump(jump_target.element, jump_target.before);
            }
          }
        }
        else if (dir == "right") {
          var next_order = caret_parent.attr('order');
          next_order = next_order ? parseInt(next_order) + 1 : 0;

          //decide whats the next field
          if ((next_field = caret.next('.simple-field')).length > 0) {
            before = false;
            if (event.data.reason == 'moving' && caret_grandparent.hasClass('word') && next_field.next().length == 0)
              continue_walking = true;

          }
          else if ((next_field = caret_parent.find('.new-field').not('#caret .new-field').sort(module.functions.order)).length > 0) {

          }
          else if ((next_field = caret.next().children('.new-field')).length > 0) {}
          else if ((next_field = caret.next().children('.pass-through').sort(module.functions.order)).length > 0) {
            continue_walking = caret.next().hasClass('word');

          }
          else if ((next_field = caret.next().find('.new-field')).length > 0) {}
          else if ((next_field = caret.next().find('.pass-through').sort(module.functions.order)).length > 0) {

          }
          else if ((next_field = caret_parent.siblings('.new-field')).length > 0) {}
          else if ((next_field = caret_parent.siblings('.pass-through')
              .filter(function () {
                var $this = $(this);
                var order = $this.attr('order');
                order = order ? parseInt(order) : null;
                if (order) {
                  return order >= next_order;
                }
                else {
                  return $this.index() > caret_parent.index();
                }
              })
              .sort(module.functions.order)).length > 0) {

          }
          else if ((next_field = caret.parents('.complex-field').first()).length > 0) {
            before = false;
          }
          else {
            next_field = math_container;
            before = false;
          }

          if (next_field.length >= 1) {
            next_field = next_field.first();
            module.functions.jump(next_field, before);
          }

        }
        else if (dir == "down") {
          if (caret_grandparent.hasClass('fraction')) {
            module.functions.jump(caret_grandparent.children().last());
          }
          else if (caret_grandparent.hasClass('root')) {
            module.functions.jump(caret_grandparent.children('.inner'));
          }
          else if (caret_parent.is('td')) {
            var next_row = caret_grandparent.next();
            var index = caret_parent.index();
            if (next_row.length > 0) {
              module.functions.jump(next_row.children().eq(index));
            }
          }
          else {
            var line = module.functions.find_offset_line(1);
            if (line && line.length > 0) {
              var jump_target = module.functions.find_aligned_jump_target(line);
              module.functions.jump(jump_target.element, jump_target.before);
            }
          }
        }
        else if (dir == "left") { //left
          before = false;

          var next_order = caret_parent.attr('order');
          next_order = next_order ? parseInt(next_order) - 1 : 0;

          if ((next_field = caret.prev('.simple-field')).length > 0) {
            before = true;
            if (event.data.reason == 'moving' && caret_grandparent.hasClass('word') && next_field.prev().length == 0)
              continue_walking = true;

          }
          else if ((next_field = caret.prev().children('.new-field')).length > 0) {}
          else if ((next_field = caret.prev().children('.pass-through').sort(module.functions.order)).length > 0) {
            continue_walking = caret.prev().hasClass('word');

          }
          else if ((next_field = caret.prev().find('.new-field')).length > 0) {}
          else if ((next_field = caret.prev().find('.pass-through').sort(module.functions.order)).length > 0) {

          }
          else if ((next_field = caret_parent.siblings('.new-field')).length > 0) {}
          else if ((next_field = caret_parent.siblings('.pass-through')
              .filter(function () {
                var $this = $(this);
                var order = $this.attr('order');
                order = order ? parseInt(order) : null;
                if (order) {
                  return order <= next_order;
                }
                else {
                  return $this.index() < caret_parent.index();
                }
              })
              .sort(module.functions.order)).length > 0) {

          }
          else if ((next_field = caret.parents('.complex-field').first()).length > 0) {
            before = true;
          }
          else {
            next_field = math_container;
            before = true;
          }

          if (next_field.length > 0) {
            next_field = next_field.last();
            module.functions.jump(next_field, before);
          }
        }

        //check if the caret is in a forbidden place, if so - continue walking
        caret_parent = caret.parent();
        var is_forbidden = false;

        if (caret_parent.hasClass('radial-c') && caret.index() == 0 && caret.siblings().length > 0)
          is_forbidden = true;

        if (caret_parent.hasClass('forbidden'))
          is_forbidden = true;

        if (caret_parent.hasClass('complex-field'))
          is_forbidden = true;

        if (is_forbidden || continue_walking) walk_caret();
      }

      if (module.formula_mode) {
        var dir = event.data.direction;
        var caret = app.modules.writing_tools.carets[0];

        walk_caret(app.modules.editor_ui.note_body);
      }
    },

    write_space: function () {
      var module = app.modules.editor;
      var expression_templates = module.expression_templates;
      if (module.formula_mode) {
        var caret = app.modules.writing_tools.carets[0];
        var caret_parent = caret.parent();
        if (caret_parent.is('td')) {
          module.functions.add_matrix_column(caret_parent);
        }
        else {
          module.functions.write_element(
            expression_templates.punctuation["Space"].clone());
        }
      }
    },

    backspace_tap: function () {
      var module = app.modules.editor;
      var writing_tools = app.modules.writing_tools;

      function siblings_are_empty(element, except) {
        if (!element.parent().hasClass('complex-field')) return false;
        var empty = true;
        var siblings = element.siblings();
        if (except) siblings = siblings.not(except);
        siblings.each(function () {
          empty = empty && $(this).children().length == 0;
        });

        return empty;
      }

      function delete_complex() {
        var complex_field = caret.parents('.complex-field').first();
        if (complex_field.length == 1) {
          module.functions.jump(complex_field, true);
          caret_parent = caret.parent();
          complex_field.remove();
          //clean up radial recursively
          if (
            (caret_parent.hasClass('radial-c') &&
              caret_parent.children().length == 1 &&
              siblings_are_empty(caret_parent)) ||
            caret_parent.hasClass('complex-field') ||
            (caret_parent.is('tbody') &&
              caret_parent.children().length == 1)
          ) {
            delete_complex();
          }
        }
      }

      if (!writing_tools.select_mode) {
        app.notify({
          type: 'create_restore_point'
        });

        var caret = app.modules.writing_tools.carets[0];
        var caret_parent = caret.parent();
        var should_delete_complex = false;
        var prev = caret.prev('.simple-field');

        if (prev.length == 1) {
          if (
            (caret_parent.hasClass('radial-tr') || caret_parent.hasClass('radial-br')) &&
            caret_parent.children().length == 2 &&
            siblings_are_empty(caret_parent, '.radial-c')
          ) {
            // Delete the radial that has only exponent or index,
            // and move what's in .radial-c outside
            var radial = caret_parent.parent();
            var contents = caret_parent.siblings('.radial-c').children();
            contents.detach();

            if (radial.parent().hasClass('math-container') && !contents.hasClass('brackets')) {
              var word = $('<div class="complex-field word">');
              var word_content = $('<div class="crucial pass-through field">');
              word.append(word_content.append(contents));
              radial.after(word);
              module.functions.jump(word);
            }
            else {
              radial.after(contents);
              module.functions.jump(contents.last());
            }

            radial.remove();
            caret_parent = caret.parent();
          }
          else if (
            caret_parent.children().length == 2 &&
            siblings_are_empty(caret_parent, '.radial-c')
          ) {
            // Delete the whole complex field recursively if all siblings are empty
            delete_complex();
          }
          else {
            // Just delete the prev .simple-field
            prev.remove();
            if (caret_parent.parent().hasClass('word') && caret.prev().length == 0) {
              app.notify({
                type: 'move_caret',
                data: {
                  direction: 'left'
                }
              });
            }
          }
        }
        else {
          if (caret.prev('.complex-field').length == 1) {
            prev = caret.prev();
            if (prev.hasClass('word')) {
              module.functions.jump(prev.children().first().children().last());
              app.notify({
                type: 'backspace_tap'
              });
            }
            else {
              app.notify({
                type: 'move_caret',
                data: {
                  direction: 'left',
                  reason: 'deleting'
                }
              });
            }

          }
          else if (caret.next().length == 0) { // caret_parent is empty
            if (caret_parent.hasClass('crucial') || siblings_are_empty(caret_parent, '.radial-c')) {
              delete_complex();
            }
            else {
              app.notify({
                type: 'move_caret',
                data: {
                  direction: 'left',
                  reason: 'deleting'
                }
              });
            }
          }
        }

        caret_parent = caret.parent();
        var caret_parent_children = caret_parent.children();
        if (caret_parent_children.length > 0) {
          module.functions.format_out(caret_parent_children.first());
        }
        else {
          module.functions.format(caret_parent);
        }

        if (caret_parent.hasClass('forbidden')) {
          app.notify({
            type: 'move_caret',
            data: {
              direction: 'left',
              reason: 'moving'
            }
          });
        }
        else {
          app.notify({
            type: 'caret_jumped',
            data: {
              caret_parent: caret.parent()
            }
          })
        }

        module.functions.clean_up_matrix_column();
      }
    },

    home_key_press: function () {
      var module = app.modules.editor;
      var current_line = module.functions.find_current_line();
      if (current_line && current_line.length > 0) {
        var first_element = current_line[0];
        var before = !first_element.hasClass('line-break');
        module.functions.jump(current_line[0], before);
      }
    },

    end_key_press: function () {
      var module = app.modules.editor;
      var current_line = module.functions.find_current_line();
      if (current_line && current_line.length > 0) {
        var last_element = current_line[current_line.length - 1];
        if (!last_element.hasClass('caret')) {
          var before = last_element.hasClass('line-break');
          module.functions.jump(last_element, before);
        }
      }
    },

    delete_press: function () {
      var module = app.modules.editor;
      var writing_tools = app.modules.writing_tools;

      if (!writing_tools.select_mode) {
        app.notify({
          type: 'create_restore_point'
        });

        var caret = app.modules.writing_tools.carets[0];
        var next = caret.next();

        if (next.hasClass('word')) {
          module.functions.jump(next.children().first().children().first());
          app.notify({
            type: 'backspace_tap'
          });
        }
        else {
          next.remove();
        }

        module.functions.clean_up_matrix_column();
      }
    },

    open_bracket: function (event) {
      var module = app.modules.editor;
      var writing_tools = app.modules.writing_tools;
      var character = event.data.character;
      var caret = writing_tools.carets[0];
      var wrap = writing_tools.selection != null;
      if (wrap) {
        app.notify({
          type: 'cut'
        });
      }
      module.functions.write_character(character);
      if (wrap) {
        app.notify({
          type: 'paste'
        });
        module.functions.format(caret.parents('.brackets').first());
      }
    },

    close_bracket: function () {
      var module = app.modules.editor;
      var caret = app.modules.writing_tools.carets[0];
      var caret_parent = caret.parent();
      var brackets = caret.parents('.brackets').first();
      if (brackets.length > 0) {
        module.functions.jump(brackets);
      }
      else if (caret_parent.hasClass('field')) {
        var children = caret_parent.children().not('.caret').detach();
        module.functions.write_character('(');
        brackets = caret.parents('.brackets').first();
        caret.before(children);
        module.functions.format(brackets);
        module.functions.jump(brackets);
      }
    },

    autocomplete_chosen: function (event) {
      var module = app.modules.editor;
      module.functions.focus();
      var caret = app.modules.writing_tools.carets[0];
      for (var i = 0; i < event.data.num_letters; i++)
        caret.prev().remove();

      module.functions.write_html(event.data.container);
    },

    selected: function () {
      var module = app.modules.editor;
      module.functions.focus();
    },

    note_ready: function (event) {
      var module = app.modules.editor;
      var editor_ui = app.modules.editor_ui;
      var data = event.data;

      module.functions.reset();
      editor_ui.note_title.val(data.title);
      editor_ui.note_body.html(data.body);

      app.notify({
        type: "module_ready",
        data: {
          name: "editor"
        }
      });
    },

    new_note_tap: function (event) {
      app.modules.editor.functions.reset();
      app.notify({
        type: "module_ready",
        data: {
          name: "editor"
        }
      });
    },

    confirm_delete_file: function () {
      if (app.modules.deeplinking.current_page == "editor") {
        app.modules.editor.functions.reset(true);
      }
    }
  },

  functions: {
    format: function (element) {
      var module = app.modules.editor;
      var element_height = element.height();
      var element_width = element.width();
      var element_children = element.children();
      var em = module.functions.get_em(element);

      if (element.hasClass('radial')) {

        var tr = element_children.eq(1);
        var tr_position = tr.position();
        var br = element_children.eq(3);
        var br_position = br.position();
        var br_margin_top = parseFloat(br.css('margin-top'));

        var top_margin = Math.max(0, -tr_position.top);
        var bottom_margin = Math.max(0, br_position.top + br_margin_top + br.height() + br.padding_top - element_height);

        var margin_right_correction = 0;
        if (element.hasClass('integral')) {
          margin_right_correction = 0.15 * em;
        }

        element
          .css('margin-top', top_margin / em + 'em')
          .css('margin-right', Math.max((Math.max(tr.width(), br.width()) + margin_right_correction) / em, 0.05).toFixed(3) + 'em')
          .css('margin-bottom', bottom_margin / em + 'em');

      }
      else if (element.hasClass('root')) {
        element_children.eq(0).css('bottom', element_height * 0.7 / em + 'em');
      }
      else if (element.hasClass('brackets')) {
        if (element.children().eq(1).children('br').length > 0) {
          element.css('vertical-align', 'middle');
        }
        else {
          element.css('vertical-align', 'initial');
        }
      }

      element.children('.stretched').each(function () {
        var $this = $(this);
        var factor = element_height / $this.height();
        $this
          .css('transform', 'scale(1, ' + factor + ')')
          .css('-o-transform', 'scale(1, ' + factor + ')')
          .css('-ms-transform', 'scale(1, ' + factor + ')')
          .css('-webkit-transform', 'scale(1, ' + factor + ')')
          .css('-moz-transform', 'scale(1, ' + factor + ')');
      });

      element.children('.horizontally-stretched').each(function () {
        var $this = $(this);
        var factor = element_width / $this.width();
        $this
          .css('transform', 'scale(' + factor + ', 1)')
          .css('-o-transform', 'scale(' + factor + ', 1)')
          .css('-ms-transform', 'scale(' + factor + ', 1)')
          .css('-webkit-transform', 'scale(' + factor + ', 1)')
          .css('-moz-transform', 'scale(' + factor + ', 1)');
      });
    },

    write_element: function (new_element) {
      var module = app.modules.editor;
      module.functions.insert_element(new_element);
      app.notify({
        type: "move_caret",
        data: {
          direction: "right",
          reason: 'writing'
        }
      });
      module.functions.format_out(new_element);
    },

    write_character: function (character) {
      var field_classes = {
        'number': "0123456789",
        'margin-field': "+-*=><",
        'operator': '+-*=><%',
        'glued-field': '.,',
        'wide': "=><"
      };

      var combined_class = "";
      $.each(field_classes, function (char_class, chars) {
        if (chars.indexOf(character) > -1) {
          combined_class += char_class + " ";
        }
      });

      var expression_conversions = {
        '*': 'algebra > Times',
        '(': 'brackets > Round brackets',
        '[': 'brackets > Square brackets',
        '{': 'brackets > Curly brackets',
        " ": 'punctuation > Space',
        ",": 'punctuation > Comma',
        ".": 'punctuation > Full stop',
        ":": 'punctuation > Colon',
        ";": 'punctuation > Semicolon',
        "?": 'punctuation > Question mark'
      };

      var temp_key = $('<div></div>');

      if (expression_conversions.hasOwnProperty(character)) {
        temp_key.attr('expression', expression_conversions[character]);
      }
      else {
        temp_key.append($('<div class="simple-field ' + combined_class + '">' + character + '</div>'));
      }

      app.notify({
        type: 'key_tap',
        data: {
          key: temp_key
        }
      });
    },

    insert_element: function (new_element) {
      app.notify({
        type: 'create_restore_point'
      });

      app.notify({
        type: 'hide_autocomplete'
      });

      var caret = app.modules.writing_tools.carets[0];
      var caret_parent = caret.parent();

      var is_word_separator =
        new_element.hasClass('space') ||
        new_element.hasClass('line-break') ||
        new_element.hasClass('complex-field') ||
        new_element.hasClass('operator') ||
        new_element.hasClass('logic') ||
        new_element.hasClass('sets') ||
        new_element.hasClass('calculus');

      if (caret_parent.parent().hasClass('word')) {
        if (is_word_separator) {
          // Break the current word
          if (caret_parent.children().length == 1) {
            // If the current word has only the caret
            caret_parent.parent().after(caret);
            caret_parent.parent().remove();
            caret.after(new_element);
          }
          else {
            var next_all = caret.nextAll();
            next_all.detach();
            caret_parent.parent().after(caret);
            caret.after(new_element);

            if (next_all.length > 0) {
              var word = $('<div class="complex-field word">');
              var word_field = $('<div class="crucial pass-through field">');
              word.append(word_field);
              word_field.append(next_all);
              new_element.after(word);
            }
          }
        }
        else {
          caret.after(new_element);
        }
      }
      else if (caret_parent.hasClass('math-container')) {
        if (is_word_separator) {
          caret.after(new_element);
        }
        else {
          var prev = caret.prev();
          if (prev.length == 1 && prev.hasClass('word')) {
            // Joing the previous word
            prev.children().first().append(caret);
          }
          else {
            // Start a new word
            var word = $('<div class="complex-field word">');
            var word_field = $('<div class="crucial pass-through field">');
            word.append(word_field);
            caret.after(word);
            word_field.append(caret);
          }
          caret.after(new_element);
        }
      }
      else {
        caret.after(new_element);
      }
    },

    write_html: function (container) {
      var module = app.modules.editor;
      var caret = app.modules.writing_tools.carets[0];
      var child_id = null;

      container.children().each(function () {
        var child = $(this).clone();
        module.functions.write_element(child);
      });
    },

    format_out: function (element) {
      var module = app.modules.editor;
      element.parents('.radial, .root, .brackets, .vector').each(function () {
        module.functions.format($(this));
      });
    },

    jump: function (element, before) {
      var caret = app.modules.writing_tools.carets[0];

      if (element.hasClass('field') || element.hasClass('math-container')) {
        caret.detach();

        if (element.hasClass('new-field')) {
          element.removeClass('new-field');
          element.text('');
        }

        if (arguments.length > 1 && before) {
          element.prepend(caret);
        }
        else {
          element.append(caret);
        }

      }
      else if (element.hasClass('simple-field') || element.hasClass('complex-field')) {
        if (arguments.length > 1 && before) {
          element.before(caret);
        }
        else {
          element.after(caret);
        }
      }

      app.notify({
        type: 'caret_jumped',
        data: {
          caret_parent: caret.parent()
        }
      });
    },

    get_em: function (element) {
      var module = app.modules.editor;
      var em_measure = module.em_measure;
      element.append(em_measure);
      var em = em_measure.height();
      em_measure.detach();
      return em;
    },

    reset: function (notify) {
      var module = app.modules.editor;
      var editor_ui = app.modules.editor_ui;

      module.formula_mode = false;

      editor_ui.note_title.val('');
      editor_ui.note_body.html('');
      if (notify) {
        app.notify({
          type: "editor_reseted"
        });
      }
    },

    get_prev: function (opt) {
      var options = {
        only: opt.only ? opt.only : null,
        until: opt.until ? opt.until : null,
        clone: opt.clone ? opt.clone : false
      };

      var prev = [];
      var caret_prev = app.modules.writing_tools.carets[0].prev();

      while (caret_prev.length > 0) {
        var prev_class = caret_prev.attr('class');
        var stop = false;

        if (options.only && !prev_class.match(options.only)) stop = true;
        if (options.until && prev_class.match(options.until)) stop = true;

        if (stop) {
          break;
        }
        else {
          prev.push(options.clone ? caret_prev.clone() : caret_prev);
          caret_prev = caret_prev.prev();
        }
      }

      prev.reverse();
      return prev;
    },

    order: function (a, b) {
      var a_order = $(a).attr('order');
      var b_order = $(b).attr('order');
      if (a_order === undefined || b_order === undefined) {
        return 0;
      }
      else {
        return parseInt(a_order) > parseInt(b_order) ? 1 : -1;
      }
    },

    parse_expression: function (str) {
      var module = app.modules.editor;

      function get_reference(path) {
        var props = path.split(/ *> */);
        var ref = module.expression_templates;
        for (var i = 0; i < props.length; i++) {
          if (ref) {
            ref = ref[props[i]];
          }
          else {
            console.log(str);
          }
        }
        return ref;
      }

      var paths = str.split(/ *, */);
      var result = [];
      for (var i = 0; i < paths.length; i++)
        result.push(get_reference(paths[i]));

      return result;
    },

    find_current_line: function (cached_lines) {
      var writing_tools = app.modules.writing_tools;
      var editor_ui = app.modules.editor_ui;
      var lines = cached_lines;
      if (!lines) {
        lines = writing_tools.functions
          .separate_lines(editor_ui.note_body.children());
      }
      var current_line = lines.find(function (line) {
        for (var i = 0; i < line.length; i++) {
          if (line[i].hasClass('caret') || line[i].find('.caret').length > 0)
            return true;
        }
        return false;
      });

      return current_line;
    },

    find_offset_line: function (offset) {
      var module = app.modules.editor;
      var writing_tools = app.modules.writing_tools;
      var editor_ui = app.modules.editor_ui;
      var lines = writing_tools
        .functions.separate_lines(editor_ui.note_body.children());

      var current_line = module.functions.find_current_line(lines);
      var current_line_index = lines.indexOf(current_line);

      var result_index = current_line_index + offset;
      if (result_index > -1 && result_index < lines.length) {
        return lines[result_index];
      }
      else {
        return null;
      }
    },

    find_aligned_jump_target: function (line) {
      var caret = app.modules.writing_tools.carets[0];
      var caret_left = caret.offset().left;
      var min_dist = 100000;
      var closest_element = null;
      var before = false;

      for (var i = 0; i < line.length; i++) {
        var element = line[i];
        var element_left = element.offset().left;
        var element_right = element_left + element.width();
        var left_dist = Math.abs(caret_left - element_left);
        var right_dist = Math.abs(caret_left - element_right);

        if (left_dist < right_dist) {
          if (left_dist < min_dist) {
            closest_element = element;
            min_dist = left_dist;
            before = true;
          }
        }
        else {
          if (right_dist < min_dist) {
            closest_element = element;
            min_dist = right_dist;
            before = element.hasClass('line-break');
          }
        }
      }

      return {
        element: closest_element,
        before: before
      };
    },

    add_matrix_row: function (current_row) {
      var num_columns = current_row.children().length;
      var new_row = $('<tr class="complex-field">');
      for (var i = 0; i < num_columns; i++) {
        var new_column = $('<td class="pass-through field">');
        new_row.append(new_column);
      }
      current_row.after(new_row);
      app.notify({
        type: 'field_tap',
        data: {
          field: new_row.children().first()
        }
      });
    },

    add_matrix_column: function (current_cell) {
      var tbody = current_cell.parent().parent();
      var rows = tbody.children();
      var index = current_cell.index();
      rows.each(function () {
        var row = $(this);
        var cell = row.children().eq(index);
        var new_cell = $('<td class="pass-through field">');
        cell.after(new_cell);
      });
      app.notify({
        type: 'field_tap',
        data: {
          field: current_cell.next()
        }
      });
    },

    clean_up_matrix_column: function () {
      var module = app.modules.editor;
      var caret = app.modules.writing_tools.carets[0];
      var caret_parent = caret.parent();
      if (caret_parent.is('td')) {
        var index = caret_parent.index();
        var tbody = caret_parent.parent().parent();
        var rows = tbody.children();
        var column_empty = true;

        rows.each(function () {
          var row = $(this);
          var cell = row.children().eq(index);
          if (cell.children().not('.caret').length > 0) {
            column_empty = false;
          }
        });

        if (column_empty) {
          var prev_cell = caret_parent.prev();
          module.functions.jump(prev_cell);
          rows.each(function () {
            var row = $(this);
            row.children().eq(index).remove();
          })
        }
      }
    },

    focus: function () {
      var module = app.modules.editor;
      module.textarea.trigger('focus');
      module.formula_mode = true;
    }
  }
};
