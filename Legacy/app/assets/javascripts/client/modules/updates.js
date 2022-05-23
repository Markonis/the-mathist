app.modules.updates = {
	init: function () {
		
	},
	
	actions: {
		logged_in: function () {
			$.ajax({
			    type: 'GET',
				url: "client/updates",
				success: function (response) {
					console.log(response);
					if(response.status){
						var updates = response.data;
						app.modules.util.functions.repeat_template($('#update-template'), updates);
						app.notify({type: "module_ready", data: {name: "updates"}});
					}
				}			
			});							
		},
		
		guest_logged_in: function () {
			app.notify({type: "module_ready", data: {name: "updates"}});
		}		
	}
}
