app.modules.deeplinking = {
	init: function () {
		var module = app.modules.deeplinking;
		module.current_page = null;
		module.activated = false;
		
		module.guest_routes = [
			"{page = guest}"
		];
		module.default_guest_route = "guest";		
		
		module.user_routes = [
		    "{page = editor}",
			"{page = home}/{tab}"
		];
		module.default_user_route = "home/notes";
	},
	
	actions: {
		logged_in: function () {
			var module = app.modules.deeplinking;
			if(!module.activated)
				module.functions.activate();
		},
		
		guest_logged_in: function () {
			app.modules.deeplinking.functions.activate();
		},
		
		hash_change: function (event) {
			var module = app.modules.deeplinking;
			var hash = event.data.hash;
			var match = true;
			var params = {};
            
			//routes with params
			var is_logged_in = app.modules.user.logged_in;
			var routes = is_logged_in ? module.user_routes : module.guest_routes;
			
			var hash_parts = hash.split('\/');
			for(var i = 0; i < routes.length; i++) {
			    var route_parts = routes[i].split('\/');
			    if(route_parts.length != hash_parts.length) {
			        match = false;
			    }else{
			        var j = 0;
    			    while (j < route_parts.length && match) {
    			        if(route_parts[j].charAt(0) != "{") {
    			            match = route_parts[j] == hash_parts[j];
    			        }else{
    			        	var param_value = hash_parts[j];        			            
							var param_template = route_parts[j].substring(1, route_parts[j].length - 1).split(/ += +/);								        			            
    			            if(param_template.length == 1 || (param_template.length == 2 && param_template[1] == param_value)){
    			            	params[param_template[0]] = param_value;
    			            }else{
    			            	match = false;
    			            }
    			        }
    			        j++;
    			    }
			    }
			    
			    if (match) {
			    	if(!app.silent_change)
			    		app.notify({ type: "deeplink_match", data: {params: params, prev_page: app.modules.deeplinking.current_page}})
					console.log(params);
					break;
				} else if(i < routes.length - 1){
					params = {}; //reset params
					match = true; //be optimistic about the next one
				}
			}
			
			if(match) {
				module.current_page = params.page;
				app.notify({ type: "module_ready", data: { name: "deeplinking" } });
			}else{   				
				app.functions.hash_change(is_logged_in ? module.default_user_route : module.default_guest_route);
			}        
		}	
	},
	
	functions: {
		activate: function () {
			$(window).on('hashchange', function () {				
				app.notify({type: "hash_change", data:{hash: window.location.hash.substring(1)}});
				app.silent_change = false;
			});
			
			app.modules.deeplinking.activated = true;
			app.notify({type: "hash_change", data: {hash: window.location.hash.substring(1)}});
		}
	}
}