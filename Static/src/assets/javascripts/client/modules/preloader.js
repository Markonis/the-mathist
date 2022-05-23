app.modules.preloader = {
    
	init: function () {
		var module = app.modules.preloader;		
		module.modules_list = {};
		module.preloader = $('#preloader');		
		
		$.each(app.modules, function (name, module){
			app.modules.preloader.modules_list[name] = false;
		});
		
		app.modules.preloader.functions.position_title();
	},
	
	post_init: function () {
		app.notify({type: "module_ready", data: {name: "preloader"}});		
	},
	
	actions: {
		module_ready: function (event) {
			var module = app.modules.preloader;
			module.modules_list[event.data.name] = true;
			
			if(module.functions.check_all_ready()) {
				//hide the preloader screen
				module.functions.hide();
			}
		},
		
		module_not_ready: function (event) {
			var module = app.modules.preloader; 
			module.modules_list[event.data.name] = false;
			if(!module.functions.check_all_ready()) {
				module.functions.show();
			}
		},
		
		window_resize: function () {
			app.modules.preloader.functions.position_title();
		}
	},
	
	functions: {
		check_all_ready: function () {
			var module = app.modules.preloader;
			var num_ready = 0;
			var num = 0;
			$.each(module.modules_list, function (name, ready){
				num++;
				if(ready) num_ready++				
			});
			return num_ready == num;
		},
		
		show: function () {
			app.modules.preloader.preloader.removeClass('invisible');
		},
		
		hide: function () {
			app.modules.preloader.preloader.addClass('invisible');
		},
		
		position_title: function () {
			var preloader = app.modules.preloader.preloader; 
			var h2 = preloader.children('h2').first().removeClass('invisible'); 
			h2.css('line-height', preloader.height() + "px");
		}
	}
}