app.modules.notifications = {	
	init: function () {
		var module = app.modules.notifications;
		var app_ui = app.modules.app_ui;		
		
		module.notification = $('<div id="notification" class="fixed invisible inline padded shadowed rounded bordered light gray"></div>');
		module.text = $('<div class="inline"></div>');
		module.icon = $('<div class="v-centered icon"></div>');
		module.notification.append(module.text);
		module.notification.append(module.icon);
		
		app_ui.main_container.append(module.notification);
	},

	post_init: function () {
		app.notify({type: "module_ready", data: {name: "notifications"}});
	},
	
	functions: {
		show: function (text, icon_class) {
			var module = app.modules.notifications;
			
			module.icon.removeClass();
			module.icon.addClass('v-centered icon ' + icon_class);
					
			module.text.text(text);
			module.notification.removeClass('invisible');
			
			setTimeout(function () {
				app.modules.notifications.notification.addClass('invisible');
			}, 5000);
		}
	},
	
	actions: {}
}