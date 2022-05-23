app.modules.home = {
	init: function (){
		var module = app.modules.home;
		module.logo = $('#logo');
		module.home_container = $('#home-container');
		module.friends_dialog = $('#friends-dialog');
		module.feedback_dialog = $('#feedback-dialog'); 		
		module.help_dialog = $('#help-dialog');
		
		$('#show-friends-dialog').on('tap', function () {
			app.notify({type: 'open_dialog_tap', data:{dialog: app.modules.home_ui.friends_dialog}});
		});
		
		$('#show-help-dialog').on('tap', function () {
			app.notify({type: 'open_dialog_tap', data:{dialog: module.help_dialog}});
		});
		
		$('#show-feedback-dialog').on('tap', function () {
			app.notify({type: 'open_dialog_tap', data:{dialog: module.feedback_dialog}});
		});
		
		$('#send-feedback').on('tap', function () {
			app.notify({type: 'send_feedback_tap', data: {text: $('#feedback').val()}});
		});

		module.tabs = "notes, feed";
	},
	
	post_init: function () {
		app.notify({type: "module_ready", data: {name: "home"}});
	},

	actions: {
		send_feedback_tap: function () {
			$('#feedback').val('');
			app.notify({type: "close_dialog_tap"});
		},
		
		invite_friends_tap: function () {
			$('#invite-text').val('');
			app.notify({type: "close_dialog_tap"});
		},
		
		tab_chosen: function (event) {
			if(app.modules.deeplinking.current_page == "home"){
				if(app.modules.home.tabs.indexOf(event.data.tab) > -1){
					app.functions.silent_hash_change('home/' + event.data.tab);
				}
			}			
		},
		
		deeplink_match: function (event) {
			var params = event.data.params;
			if(params.page == "home"){
				var tab = null;

				if(app.modules.home.tabs.indexOf(event.data.tab) > -1){
					tab = params.tab;
				}else{
					tab = 'notes';
				}
				
				app.notify({type: 'toggle_tap', data:{button: $('.toggle.btn[tab=' + tab + ']')}});
				app.notify({type: 'tab_chosen', data:{tab: tab}});
			}
		}		
	},
	
	functions: {}
}