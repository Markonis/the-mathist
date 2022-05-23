/* global app $ */
app.modules.keyboard_ui = {
	init: function (){
		var module = app.modules.keyboard_ui;
		module.language = 0;
		module.upper_case = false;
		module.radial = $('#radial');
		module.numeric = $('#numeric');
		module.letters = $('#letters');
		module.signs = $('#signs');
		module.group = $('#group');
		module.group_key = null;

		//register events
		var editor_container = app.modules.editor_ui.editor_container;
		editor_container.on('tap', '.key:not(.passive, [action], .group-key)', function () {
			app.notify({type: "key_tap", data: {key: $(this)}});
		});

		editor_container.on('tap', '.group-key', function () {
			app.notify({type: "key_tap", data: {key: $(this)}});
		});

		editor_container.on('press', '.group-key', function () {
			app.notify({type: "key_hold", data: {key: $(this)}});
		});

		editor_container.on('tap', '#show-keyboard-settings', function () {
			app.notify({type:'show_keyboard_settings_tap', data:{btn: $(this)}});
		});

		editor_container.on('tap', '[qwerty-type]', function () {
			app.notify({type: 'qwerty_type_change', data:{type: $(this).attr('qwerty-type')}});
		});

		editor_container.on('tap', '#letters', function (event) {
			if($(event.target).attr('id') == "letters"){
				app.notify({type: 'letters_tap'});
			}
		});

		editor_container.on('tap', '#backspace', function (event) {
			app.notify({type: 'backspace_tap'});
		});

		editor_container.on('tap', '#shift', function (event) {
			app.notify({type: 'shift_tap'});
		});

		//qwerty
		module.qwerty_glyphs = [
			['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
			['θ', 'ω', 'ε', 'ρ', 'τ', 'ψ', 'υ', 'ι', 'ο', 'π', 'α', 'σ', 'δ', 'φ', 'γ', 'η', 'ς', 'κ', 'λ', 'ζ', 'χ', 'ξ', 'ω', 'β', 'ν', 'μ']
		];

		module.functions.hide_group();
		module.functions.populate();

		//group & template keys
		$('.group-key, .template-key').each(function (){
			var editor = app.modules.editor;
			var group = editor.functions.parse_expression($(this).attr('expression'));
			$(this).data('group', group);
		});

		$('.template-key').each(function () {
			$(this).append($(this).data('group')[0].clone());
		});

		app.notify({type: "module_ready", data: {name: "keyboard_ui"}});
	},

	functions: {
		populate: function () {
			var module = app.modules.keyboard_ui;
			var letters_container = module.letters;

			var key_template = $('<div class="inline bordered light gray key"><div class="simple-field"></div></div>');
			var break_template = $('<br>');
			var glyphs = module.qwerty_glyphs;

			populate_row(0,10);
			letters_container.append(break_template.clone())

			populate_row(10,19);
			letters_container.append(break_template.clone());

			letters_container.append($('<div id="shift" class="inline bordered dark gray passive key"><i class="fa fa-arrow-up"></i></div>'));
			populate_row(19,26);
			letters_container.append($('<div id="enter" class="inline bordered dark gray passive key" action=\'{"type": "enter_press"}\'><i class="fa fa-level-down"></i></div>'));

			letters_container.append(break_template.clone());
			letters_container.append($('<div id="show-keyboard-settings" class="inline bordered dark gray passive key"><i class="fa fa-cog"></i></div>'));
			letters_container.append($('<div id="space" class="inline bordered light gray key" style="width: 50%; height: 2.2em" action=\'{"type": "space_tap"}\'></div>'))
			letters_container
				.append($('<div class="inline bordered dark gray group-key template-key key"></div>').attr('expression',
					'punctuation > Full stop,' +
					'punctuation > Comma,' +
					'punctuation > Colon,' +
					'punctuation > Semicolon,' +
					'punctuation > Question mark,' +
					'punctuation > Horizontal ellipsis,' +
					'calculus > Derivative'
				));

			function populate_row(s, e) {
				for(var i = s; i < e; i++){
					var key = key_template.clone();
					key.children().first().text(glyphs[0][i]);
					letters_container.append(key);
				}
			}
		},

		update_glyphs: function () {
			var module = app.modules.keyboard_ui;
			var glyphs = module.qwerty_glyphs;
			var i = 0;
			module.letters
				.find('.key > .simple-field')
				.not('#space > .simple-field')
				.each(function () {
					if(i < glyphs[module.language].length){
						$(this).text(module.upper_case ? glyphs[module.language][i++].toUpperCase(): glyphs[module.language][i++]);
					}
				});
		},

		position_group: function() {
			var module = app.modules.keyboard_ui;
			var container_offset = app.modules.editor_ui.editor_container.offset();
			var group = module.group;
			var key_width = module.group_key.width();
			var key_offset = module.group_key.offset();
			group.css('top', key_offset.top - group.innerHeight()).css('left', key_offset.left + (key_width - group.width())/2);
		},

		hide_group: function () {
			var module = app.modules.keyboard_ui;
			module.group.addClass('invisible');
			module.group_key = null;
		}

	},

	actions: {
		window_resize: function () {
			var module = app.modules.keyboard_ui;
			if(module.group_key != null){
				app.modules.keyboard_ui.functions.position_group();
			}
		},

		key_tap: function (event){
			var module = app.modules.keyboard_ui;
			module.functions.hide_group();
		},

		show_keyboard_settings_tap: function (event) {
			var module = app.modules.keyboard_ui;
			var btn_template = $('<div class="light gray writing passive key btn"></div>');
			module.group.children().remove();
			module.group
				.append(btn_template.clone().text('abc').attr('qwerty-type', '0'))
				.append(btn_template.clone().text('ABC').attr('qwerty-type', '1'))
				.append(btn_template.clone().text('αβγ').attr('qwerty-type', '2'))
				.append(btn_template.clone().text('ABΓ').attr('qwerty-type', '3'));
			module.group_key = event.data.btn;
			module.group.removeClass('invisible');
			module.functions.position_group();
		},

		qwerty_type_change: function (event) {
			var module = app.modules.keyboard_ui;
			var type = parseInt(event.data.type);
			var l = 0, c = false;
			switch(type){
				case 1: //ENG
					c = true;
					break;
				case 2: //gr
					l = 1;
					break;
				case 3: //GR
					l = 1;
					c = true;
					break;
			}

			module.language = l;
			module.upper_case = c;

			module.functions.update_glyphs();
			module.functions.hide_group();
		},

		key_hold: function (event){
			var key = event.data.key;
			var expressions = key.data('group');
			if(expressions.length > 1 && app.modules.editor.formula_mode){
				var module = app.modules.keyboard_ui;

				//clear the key group
				var group = module.group;
				var key_template = app.modules.keyboard.key_template;
				group.children().remove();

				var num_rows = Math.ceil(Math.sqrt(expressions.length - 1));
				var num_columns = Math.ceil((expressions.length - 1) / num_rows);
				var line_break = $('<br>');

				//add the groupped expressions
				var index = 1
				for(var i = 0; i < num_rows; i++){
					for(var j = 0; j < num_columns && index < expressions.length; j++){
						var group_key = key_template.clone();
						group_key.append(expressions[index++].clone()).addClass('inline writing light gray btn');
						group.append(group_key)
					}
					group.append(line_break.clone());
				}


				module.group_key = key;
				group.removeClass('invisible');
				module.functions.position_group();
			}
		},

		letters_tap: function () {
			app.modules.keyboard_ui.functions.hide_group();
		},

		note_tap: function () {
			app.modules.keyboard_ui.functions.hide_group();
		},

		arrow_tap: function () {
			app.modules.keyboard_ui.functions.hide_group();
		},

		shift_tap: function () {
			var module = app.modules.keyboard_ui;
			module.upper_case = !module.upper_case;
			module.functions.update_glyphs();
			module.functions.hide_group();
		}
	}
}