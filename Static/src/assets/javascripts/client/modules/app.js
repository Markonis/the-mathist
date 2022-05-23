var app = { 
	modules: {},
	
	init: function () {
		
		//detect environment
		
		app.env = "development"; //the default
		
		var loc = window.location.toString();
		var envs = {
			"production": ["www.themathist.com"]
		}		
		
		$.each(envs, function(name, sites) {
			var match = false;
			for(var i = 0; i < sites.length; i++){
				if(loc.indexOf(sites[i]) != -1) {
					app.env = name;
					break;
				}
			}
		});
		
		//disable logging in production
		if(app.env == "production"){
			window.console.log = function () {/*no logging*/};
		}
		
		//setup global ajax
		$.ajaxSetup({
		    type: 'GET',
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (msg) {}
		});				
		
		//initialize all modules
		$.each(app.modules, function(name, module) {			
			module.init();
		});
		
		// send post_init event to to all the modules
		$.each(app.modules, function(name, module) {
			if(module.hasOwnProperty('post_init')){
				module.post_init();
			}
		});
			
		//register events general events
		app.silent_change = false;
		$(window).on('beforeunload', function () {
			app.notify({type: "page_leave"});
		});
	},
	
	functions: {
		hash_change: function (new_hash) {
			app.silent_change = false;
			window.location.hash = new_hash;
		},		
		
		silent_hash_change: function (hash){
			app.silent_change = true;
			window.location.hash = hash;
		}
	},
	
	notify: function (event) {
		$.each(app.modules, function (name, module){
			if(module.actions.hasOwnProperty(event.type)){
				module.actions[event.type](event);
			}
		});
	}
}