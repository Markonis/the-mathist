/* global app $ */
app.modules.latex = {
  init: function () {
    var module = app.modules.latex;
    module.dialog = $('#latex-dialog');
    app.notify({type: 'module_ready', data: {name: 'latex'}});
  },

  actions: {
    latex_tap: function () {
      var module = app.modules.latex;
      // Get selection
      var selection = app.modules.writing_tools.selection;
      if(selection) {
        var latex = module.functions.read(selection);
        module.dialog.find('textarea').val(latex);
        app.notify({type: 'open_dialog_tap', data: {dialog: module.dialog}});
      }
    }
  },

  functions: {
    read: function(elements) {
      var editor = app.modules.editor;

      function read_list(list) {
        var result = "";
        for(var i = 0; i < list.length; i++) {
          result += read_element($(list[i]));
        }
        return result;
      }

      function read_element(element) {
        if(element.hasClass('simple-field'))    return read_simple(element);
        else if(element.hasClass('word'))       return read_word(element);
        else if(element.hasClass('summation'))  return read_summation(element);
        else if(element.hasClass('product'))    return read_product(element);
        else if(element.hasClass('radial'))     return read_radial(element);
        else if(element.hasClass('fraction'))   return read_fraction(element);
        else if(element.hasClass('root'))       return read_root(element);
        else if(element.hasClass('limit'))      return read_limit(element);
        else if(element.hasClass('matrix'))     return read_matrix(element);
        else if(element.hasClass('brackets'))   return read_brackets(element);
        else if(element.hasClass('vector'))     return read_vector(element);
        else if(element.hasClass('overline'))   return read_overline(element);
        else if(element.hasClass('underline'))  return read_underline(element);
        else return "";
      }

      function wrap(latex) { return '{' + latex + '}'; }

      function read_word(word) { return word.text(); }

      function sub_list(element, field) {
        return element.children(field).children();
      }

      function read_radial(radial) {
        var result = read_list(sub_list(radial, '.radial-c')).trim();
        var b_list = sub_list(radial, '.radial-b');
        var br_list = sub_list(radial, '.radial-br');
        var t_list = sub_list(radial, '.radial-t');
        var tr_list = sub_list(radial, '.radial-tr');
        if(b_list.length > 0)       result += '_' + wrap(read_list(b_list).trim());
        else if(br_list.length > 0) result += '_' + wrap(read_list(br_list).trim());
        if(t_list.length > 0)       result += '^' + wrap(read_list(t_list).trim());
        else if(tr_list.length > 0) result += '^' + wrap(read_list(tr_list).trim());
        return result;
      }

      function read_summation(summation) {
        var result = '\\sum';
        var b_list = summation.children().last().children();
        var t_list = summation.children().first().children();
        if(b_list.length > 0) result += '_' + wrap(read_list(b_list).trim());
        if(t_list.length > 0) result += '^' + wrap(read_list(t_list).trim());
        return result;
      }

      function read_product(product) {
        var result = '\\prod';
        var b_list = product.children().last().children();
        var t_list = product.children().first().children();
        if(b_list.length > 0) result += '_' + wrap(read_list(b_list).trim());
        if(t_list.length > 0) result += '^' + wrap(read_list(t_list).trim());
        return result;
      }

      function read_fraction(fraction) {
        var result = '\\frac ';
        var children = fraction.children();
        result += wrap(read_list(children.first().children()));
        result += wrap(read_list(children.last().children()));
        return result;
      }

      function read_root(root) {
        var result='\\sqrt';
        var exp_list = sub_list(root, '.exp');
        var inner_list = sub_list(root, '.inner');
        if(exp_list.length > 0) result += '[' + wrap(read_list(exp_list)) + '] ';
        result += wrap(read_list(inner_list));
        return result;
      }

      function read_limit(limit) {
        var result = '\\lim';
        var list = sub_list(limit, '.field');
        if(list.length > 0) result += '_' + wrap(read_list(list));
        return result;
      }

      function read_brackets(brackets) {
        var result = '\\left ';
        var list_latex = wrap(read_list(sub_list(brackets, '.field')));
        if(brackets.hasClass('round')) result += '(' + list_latex + '\\right )';
        if(brackets.hasClass('square')) result += '[' + list_latex + '\\right ]';
        if(brackets.hasClass('curly')) result += '\\{' + list_latex + '\\right \\}';
        if(brackets.hasClass('angle')) result += '\\langle' + list_latex + '\\right \\rangle';
        if(brackets.hasClass('straight')) result += '\\lvert' + list_latex + '\\right \\rvert';
        return result;
      }

      function read_matrix(matrix) {
        var result = '\\begin{bmatrix} ';
        var rows = matrix.find('tr');
        for(var i = 0; i < rows.length; i++){
          var cells = $(rows[i]).children();
          for(var j = 0; j < cells.length; j++){
            var children = $(cells[i]).children();
            result += wrap(read_list(children));
            if(j < cells.length - 1) result += ' & ';
          }
          if(i < rows.length - 1) result += '\\\\';
        }
        result += '\\end{bmatrix}';
        return result;
      }

      function read_vector(vector) {
        return '\\vec ' + wrap(read_list((vector, '.field')));
      }

      function read_overline(overline) {
        return '\\overline ' + wrap(read_list((overline, '.field')));
      }

      function read_underline(underline) {
        return '\\underline ' + wrap(read_list((underline, '.field')));
      }

      function read_simple(simple) {
        var text = simple.text();
        var conversions = {
          '→': 'to',
          'log': 'log',
          '≠': 'neq',
          '∼': 'sim',
          '≁': 'nsim',
          '≃': 'simeq',
          '≅': 'cong',
          '≆': 'ncong',
          '>': 'gt',
          '<': 'lt',
          '≫': 'gg',
          '≪': 'll',
          '≥': 'ge',
          '≤': 'le',
          '≡': 'equiv',
          '±': 'pm',
          '∓': 'mp',
          '×': 'times',
          '⋅': 'cdot',
          '∝': 'propto',
          '%': '%',
          '∣': 'mid',
          '∤': 'nmid',
          '¬': 'neg',
          '∧': 'land',
          '∨': 'lor',
          '⊻': 'veebar',
          '⇒': 'Rightarrow',
          '⇔': 'Leftrightarrow',
          '∴': 'therefore',
          '∵': 'because',
          '∀': 'forall',
          '∃': 'exists',
          '∄': 'nexists',
          '⊤': 'top',
          '⊥': 'bot',
          '⊢': 'vdash',
          '⊂': 'subset',
          '⊃': 'supset',
          '⊆': 'subseteq',
          '⊇': 'supseteq',
          '∩': 'cap',
          '∪': 'cup',
          '∈': 'in',
          '∉': 'notin',
          '∅': 'emptyset',
          'sin': 'sin',
          'cos': 'cos',
          'tan': 'tan',
          'cotan': 'cotan',
          'arcsin': 'arcsin',
          'arccos': 'arccos',
          'arctan': 'arctan',
          'arccotan': 'arccotan',
          '∫': 'int',
          '∬': 'iint',
          '∭': 'iiint',
          '∮': 'oint',
          '∯': 'oiint',
          '∰': 'oiiint',
          'lim': 'lim',
          '∞': 'infty',
          '∂': 'partial',
          '∇': 'nabla'
        };
        var inverse_greek = {};
        $.each(editor.expression_templates.greek, function (key, value) {
          inverse_greek[value] = key;
        });
        if(conversions.hasOwnProperty(text)) return '\\' + conversions[text] + ' ';
        if(inverse_greek.hasOwnProperty(text)) return '\\' + inverse_greek[text] + ' ';
        return text;
      }

      return read_list(elements);
    },

    write: function(latex) {
      var module = app.modules.latex;
      var editor = app.modules.editor;
      var tokens = module.functions.tokenize(latex);
      var parsed_list = module.functions.parse(tokens);
      var write_element = app.modules.editor.functions.write_element;

      function write_expression(expression, depth) {
        switch(expression.type){
          case 'command':
            write_command(expression, depth);
            break;
          case 'character':
            write_character(expression, depth);
            break;
          case 'list':
            write_list(expression.list, depth);
            break;
        }
      }

      function move_right() {
        app.notify({type: 'move_caret', data: {
          direction: 'right', reason: 'moving'}});
      }

      function write_list(list, depth) {
        $.each(list, function (index, expression) {
          write_expression(expression, depth);
        });
      }

      function open_bracket(shape, depth) {
        var templates = null;
        if(shape.type == 'character'){
          templates = {
            '(': editor.expression_templates.brackets['Round brackets'],
            '[': editor.expression_templates.brackets['Square brackets'],
            '{': editor.expression_templates.brackets['Curly brackets']
          };
          write_element(templates[shape.value].clone());
        }else if(shape.type == 'command'){
          templates = {
            'lvert': editor.expression_templates.brackets['Straight brackets'],
            'langle': editor.expression_templates.brackets['Angle brackets']
          };
          write_element(templates[shape.name].clone());
        }
      }

      function apply_radial(expression) {
        if(expression.superscript){
          app.notify({type: 'radial_field_tap', data: {radial_class: 'radial-tr'}});
          write_expression(expression.superscript);
          move_right();
        }
        if(expression.subscript){
          app.notify({type: 'radial_field_tap', data: {radial_class: 'radial-br'}});
          write_expression(expression.subscript);
          move_right();
        }
      }

      function close_bracket(expression) {
        app.notify({type: 'close_bracket'});
        apply_radial(expression);
      }

      function write_command(command, depth) {
        switch(command.name) {
          // Punctuation
          case 'dots': write_punctuation(command, depth); break;
          case 'underline': write_underline(command); break;
          case 'overline': write_overline(command); break;
          case 'rightarrow':
          case 'longrightarrow':
          case 'to': write_rightarrow(command); break;
          // Brackets
          case 'langle': open_bracket(command, depth); break;
          case 'rangle': close_bracket(command); break;
          case 'lvert': open_bracket(command); break;
          case 'rvert': close_bracket(command); break;
          // Algebra
          case 'frac': write_fraction(command, depth); break;
          case 'sqrt': write_root(command, depth); break;
          case 'sum': write_summation(command, depth); break;
          case 'prod': write_product(command, depth); break;
          case 'log': write_log(command, depth); break;
          case 'vec':
          case 'overrightarrow': write_vector(command); break;
          case 'neq':
          case 'ne': write_algebraic('Not equal'); break;
          case 'sim': write_algebraic('Similar'); break;
          case 'nsim': write_algebraic('Not similar'); break;
          case 'simeq': write_algebraic('Similar or equal'); break;
          case 'cong': write_algebraic('Congruent'); break;
          case 'ncong': write_algebraic('Not congruent'); break;
          case 'gt': write_algebraic('Greater than'); break;
          case 'lt': write_algebraic('Less than'); break;
          case 'gg': write_algebraic('Much greater than'); break;
          case 'll': write_algebraic('Much less than'); break;
          case 'ge': write_algebraic('Greater or equal'); break;
          case 'le': write_algebraic('Less or equal'); break;
          case 'equiv': write_algebraic('Equivalent'); break;
          case 'pm': write_algebraic('Plus-minus'); break;
          case 'mp': write_algebraic('Minus-plus'); break;
          case 'times': write_algebraic('Times'); break;
          case 'cdot': write_algebraic('Dot'); break;
          case 'propto': write_algebraic('Proportional'); break;
          case '%': write_algebraic('Percent'); break;
          case 'mid': write_algebraic('Divides'); break;
          case 'nmid': write_algebraic('Does not divide'); break;
          // Logic
          case 'neg': write_logic('Not', depth); break;
          case 'land':
          case 'wedge': write_logic('And', depth); break;
          case 'lor':
          case 'vee': write_logic('Or', depth); break;
          case 'veebar': write_logic('Exclusive or', depth); break;
          case 'Rightarrow': write_logic('Implication'); break;
          case 'Leftrightarrow':
          case 'iff': write_logic('Equivalence'); break;
          case 'therefore': write_logic('Therefore'); break;
          case 'because': write_logic('Because'); break;
          case 'forall': write_logic('For all'); break;
          case 'exists': write_logic('Exists'); break;
          case 'nexists': write_logic('Does not exist'); break;
          case 'top': write_logic('True'); break;
          case 'top': write_logic('False'); break;
          case 'bot': write_logic('False'); break;
          case 'vdash': write_logic('Provable'); break;
          // Sets
          case 'subset': write_set('Subset'); break;
          case 'supset': write_set('Superset'); break;
          case 'subseteq': write_set('Subset or equal'); break;
          case 'supseteq': write_set('Superset or equal'); break;
          case 'cap': write_set('Intersection'); break;
          case 'cup': write_set('Union'); break;
          case 'in': write_set('Member'); break;
          case 'notin': write_set('Not member'); break;
          case 'varnothing':
          case 'O':
          case 'emptyset': write_set('Empty set'); break;
          // Trigonometry
          case 'sin': write_trigonometric('Sine', depth); break;
          case 'cos': write_trigonometric('Cosine', depth); break;
          case 'tan': write_trigonometric('Tangent', depth); break;
          case 'cotan': write_trigonometric('Cotangent', depth); break;
          case 'arcsin': write_trigonometric('Arcus sine', depth); break;
          case 'arccos': write_trigonometric('Arcus cosine', depth); break;
          case 'arctan': write_trigonometric('Arcus tangent', depth); break;
          case 'arccotan': write_trigonometric('Arcus cotangent', depth); break;
          // Calculus
          case 'int': write_integral(command, depth); break;
          case 'lim': write_limit(command, depth); break;
          case 'infty': write_calculus('Infinity'); break;
          case 'partial': write_calculus('Partial derivative'); break;
          case 'nabla': write_calculus('Nabla'); break;
          // Greek
          default:
            if(is_greek(command)) write_greek(command);
        }

        function write_fraction(fraction, depth) {
          var template = editor.expression_templates.algebra['Fraction'];
          write_element(template.clone());
          write_expression(fraction.params[0], depth + 1);
          move_right();
          write_expression(fraction.params[1], depth + 1);
          move_right();
        }

        function write_root(root, depth) {
          var template = editor.expression_templates.algebra['Root'];
          write_element(template.clone());
          if(root.option) write_expression(root.option, depth + 1);
          move_right();
          write_expression(root.params[0], depth + 1);
          move_right();
        }

        function write_radial(radial, depth, template) {
          write_element(template.clone());
          if(radial.subscript) write_expression(radial.subscript, depth + 1);
          move_right();
          if(radial.superscript) write_expression(radial.superscript, depth + 1);
          move_right();
        }

        function write_integral(integral, depth) {
          var template = editor.expression_templates.calculus['Integral'];
          write_radial(integral, depth, template);
        }

        function write_product(product, depth) {
          var template = editor.expression_templates.algebra['Product'];
          write_radial(product, depth, template);
        }

        function write_summation(summation, depth) {
          var template = editor.expression_templates.algebra['Summation'];
          write_radial(summation, depth, template);
        }

        function write_log(log, depth) {
          var template = editor.expression_templates.algebra['Logarithm'];
          write_element(template.clone());
          if(log.subscript) write_expression(log.subscript, depth + 1);
          move_right();
        }

        function write_limit(limit, depth) {
          var template = editor.expression_templates.calculus['Limit'];
          write_element(template.clone());
          if(limit.subscript) write_expression(limit.subscript, depth + 1);
          move_right();
        }

        function write_algebraic(symbol) {
          var template = editor.expression_templates.algebra[symbol];
          write_element(template.clone());
        }

        function write_logic(symbol) {
          var template = editor.expression_templates.logic[symbol];
          write_element(template.clone());
        }

        function write_set(symbol) {
          var template = editor.expression_templates.sets[symbol];
          write_element(template.clone());
        }

        function write_trigonometric(fun, depth) {
          var template = editor.expression_templates.trigonometry[fun];
          write_element(template.clone());
        }

        function write_calculus(symbol) {
          var template = editor.expression_templates.calculus[symbol];
          write_element(template.clone());
        }

        function write_overline(command) {
          var template = editor.expression_templates.punctuation['Overline'];
          editor.functions.write_element(template.clone());
          write_expression(command.params[0]);
          move_right();
        }

        function write_underline(command) {
          var template = editor.expression_templates.punctuation['Underline'];
          editor.functions.write_element(template.clone());
          write_expression(command.params[0]);
          move_right();
        }

        function write_rightarrow() {
          var template = editor.expression_templates.punctuation['Right arrow'];
          editor.functions.write_element(template.clone());
        }

        function write_vector() {
          var template = editor.expression_templates.algebra['Vector'];
          editor.functions.write_element(template.clone());
          write_expression(command.params[0]);
          move_right();
        }

        function write_punctuation(command, depth) {
          switch(command.name){
            case 'dots':
              write_dots();
              break;
          }

          function write_dots() {
            for(var i = 0; i < 3; i++) editor.functions.write_character('.');
          }
        }

        function is_greek(command) {
          return editor.expression_templates.greek.hasOwnProperty(command.name);
        }

        function write_greek(command) {
          var template = editor.expression_templates.greek[command.name];
          editor.functions.write_element(template.clone());
        }
      }

      function write_character(character, depth) {
        var left_brackets = "([{", right_brackets = "}])";
        if(left_brackets.indexOf(character.value) > -1) {
          open_bracket(character, depth);
        }else if(right_brackets.indexOf(character.value) > -1){
          close_bracket(character);
        }else{
          editor.functions.write_character(character.value);
          apply_radial(character);
        }
      }

      write_expression(parsed_list, 0);
    },

    parse: function(tokens) {
      function command_params(command, list, index) {
        var defs = {'frac': 2, 'sqrt': 1, 'overline': 1, 'underline': 1,
          'vec': 1, 'overrightarrow': 1};

        var num = 0, params = [];
        if (defs.hasOwnProperty(command.name)) num = defs[command.name];
        for(var i = 1; i <= num; i++) {
          var parsed_param = parse_expression(list[index + i], list, index + i);
          params.push(parsed_param.expression);
        }
        return params;
      }

      function parse_command(command, list, index) {
        var params = command_params(command, list, index);
        var expression = { type: 'command', name: command.name, params: params };
        if(command.superscript) expression.superscript = command.superscript;
        if(command.subscript) expression.subscript = command.subscript;
        if(command.option) expression.option = command.option;
        return { expression: expression, skip: params.length + 1 };
      }

      function parse_expression(expression, list, index) {
        switch(expression.type){
          case 'list':
            return {expression: parse_list(expression.list), skip: 1};
          case 'command':
            return parse_command(expression, list, index);
          default:
            return {expression: expression, skip: 1};
        }
      }

      function parse_list(list) {
        var index = 0, parsed_list = [];
        while(index < list.length){
          var parsing_result = parse_expression(list[index], list, index);
          parsed_list.push(parsing_result.expression);
          index += parsing_result.skip;
        }
        return {type: 'list', list: parsed_list};
      }

      return parse_list(tokens.list);
    },

    tokenize: function (latex) {
      return app.modules.latex.tokenizer.parse(latex);
    }
  }
};
