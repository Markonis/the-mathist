app.modules.settings_ui = {
	init: function () {
		var module = app.modules.settings_ui;
		module.settings_btn = $('#show-settings-dialog');
		module.dialog = $('#settings-dialog');
		module.delete_account_dialog = $('#delete-account-dialog');
		//register events
		
		module.settings_btn.on('tap', function () {
			app.notify({type: "open_dialog_tap", data: {dialog: app.modules.settings_ui.dialog}});
		});
		
		$('#font-size .btn').on('tap', function () {
			app.notify({type: "change_font_size", data:{size: $(this).attr("size")} } );
		});
		
		$('#delete-account').on('tap', function () {
			app.notify({type: "open_dialog_tap", data: {dialog: app.modules.settings_ui.delete_account_dialog}});
		});
		
		$('#confirm-delete-account').on('tap', function () {
			app.notify({type: "confirm_delete_account"});
		});
		
		$('#cancel-delete-account').on('tap', function () {
			app.notify({type: "close_dialog_tap"});
		});
		
		$('#indicate-wa').on('tap', function () {
			app.notify({type: "indicate_wa_tap"});
		})
		
	},

	post_init: function () {				
		app.notify({type: "module_ready", data: {name: "settings_ui"}});
	},
	
	actions: {}
}