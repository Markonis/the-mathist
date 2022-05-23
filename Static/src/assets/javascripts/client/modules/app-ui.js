/* global app $ */
app.modules.app_ui = {

	init: function () {
		var module = app.modules.app_ui;
		module.html = $('html');
		module.body = $('body');
		module.header = $('#header');
		module.main_container = $('#main-container');
		module.settings_panel = $('#settings-panel');
		module.current_dialog = null;
		module.icon_template = $('<div class="icon"></div>');

		module.hover_color_factor = 0.95;

		module.body.on('tap', '.dialog .close.btn', function () {
			app.notify({type: "close_dialog_tap"});
		});


		module.body.on('tap', '.btn[tab]', function () {
			app.notify({type:'tab_chosen', data:{tab: $(this).attr('tab')}});
		});

		module.body.on('tap', '.toggle.btn', function () {
			app.notify({type: 'toggle_tap', data: {button: $(this)}})
		});

		module.body.on('tap', '[action]', function () {
			app.notify(JSON.parse($(this).attr('action')));
		});


		//improved hover effect
		module.body.on('mouseenter', '.btn, .key', function () {
			app.notify({type: 'pointer_interaction_start', data:{element: $(this)}});
		});

		module.body.on('touchstart', '.btn, .key', function (event) {
			//event.preventDefault();
			app.notify({type: 'pointer_interaction_start', data:{element: $(this)}});
		});

		module.body.on('mouseleave', '.btn, .key', function () {
			app.notify({type: 'pointer_interaction_end', data:{element: $(this)}});
		});

		module.body.on('touchend', '.btn, .key', function (event) {
			//event.preventDefault();
			app.notify({type: 'pointer_interaction_end', data:{element: $(this)}});
		});

		$('.tooltip').tooltipster({
			theme: ['tooltipster-borderless', 'tooltipster-borderless-customized']
		});
	},

	post_init: function () {
		$(window).on('resize', function () {
			app.notify({type: "window_resize"})
		});

		$(window).trigger('resize');
		app.notify({type: "module_ready", data: {name: "app_ui"}});
	},

	actions: {
		window_resize: function () {
			$('.active.dialog').each(function () {
				app.modules.app_ui.functions.position_dialog($(this));
			});
		},

		open_dialog_tap: function (event) {
			var module = app.modules.app_ui;
			//hide previous one
			app.notify({type:"close_dialog_tap"});
			//show current one
			module.current_dialog = event.data.dialog;
			module.current_dialog.addClass('active');

			module.functions.position_dialog(module.current_dialog);
		},

		change_font_size: function (event) {
			var module = app.modules.app_ui;
			module.html.css('font-size', event.data.size + 'px');
            app.notify({type: 'font_size_changed'});
		},

		close_dialog_tap: function (event){
			var dialog = app.modules.app_ui.current_dialog;
			if (dialog != null) {
				dialog.removeClass('active');
				app.modules.app_ui.current_dialog = null;
			}
		},

		tab_chosen: function(event) {
			var tab_name = event.data.tab;
			var tab = $('#' + tab_name);
			tab.removeClass('invisible');
			tab.siblings().addClass('invisible');

			$('[for-tab]').each(function (){
				var $this = $(this);
				if($this.attr('for-tab') == tab_name)
					$this.removeClass('invisible')
				else
					$this.addClass('invisible');
			});
		},

		toggle_tap: function (event) {
			var button = event.data.button;
			var siblings = button.siblings('.toggle.btn');

			if(siblings.length == 0){
				if(button.hasClass('active'))
					button.removeClass('active');
				else
					button.addClass('active');
			}else{
				siblings.removeClass('active').css('background-color', '');
				button.addClass('active');
			}
			button.css('background-color', '')
		},

		pointer_interaction_start: function (event) {
			var element = event.data.element;
			if(element.data('hover_color') && !element.hasClass('toggle')){
				element.css('background-color', element.data('hover_color'));
			}else if(element.attr('hover-color')){
				element.data('hover_color', element.attr('hover-color'));
			}else{
				element.data('hover_color', app.modules.app_ui.functions.create_hover_color(element));
			}
			element.css('background-color', element.data('hover_color'));
		},

		pointer_interaction_end: function (event) {
			var element = event.data.element;
			element.css('background-color', '');
		},

		deeplink_match: function (event) {
			app.notify({type: 'show_page', data: {page: event.data.params.page}});
		},

		escape_press: function () {
		    app.notify({type: "close_dialog_tap"});
		},

		show_page: function(event){
			var page = event.data.page;
			$('#header').css('min-width', $('#' + page + '-container').css('min-width'));
			$('[for-page]').addClass('invisible');
			$('[for-page*=' + page + ']').removeClass('invisible');
			app.notify({type: 'window_resize'});
		}
	},

	functions: {
		position_dialog: function (dialog) {
			var module = app.modules.app_ui;
			dialog.css('line-height', dialog.height() + 'px');
			/*
			var dialog_content = dialog.children('.content');
			dialog_content
				.css('left', (module.body.width() - dialog_content.innerWidth())/2)
				.css('top', (module.body.height() - dialog_content.innerHeight())/2);
			*/
		},

		create_hover_color: function (element) {
			var normal_color = element.css('background-color');
			var normal_components = normal_color.substring(4, normal_color.length - 1).split(/, */);
			var hover_components = [0,0,0];
			for(var i = 0; i < 3; i++){
				hover_components[i] = Math.floor(parseInt(normal_components[i]) * app.modules.app_ui.hover_color_factor)
			}

			return 'rgb(' + hover_components[0] + ', ' + hover_components[1] + ', ' + hover_components[2] + ')';
		}
	}
};