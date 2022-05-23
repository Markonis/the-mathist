app.modules.guest = {
	init: function () {
		var module = app.modules.guest;
		module.aquired = false;
		module.was = false;
		app.modules.app_ui.header.on('tap', '#login-btn', function () {
			app.notify({ type: 'guest_login_tap' });
		});
		app.notify({ type: 'module_ready', data: { name: 'guest' } })
	},

	actions: {
		guest_login_tap: function () {
			var module = app.modules.guest;
			module.aquired = true;
			module.was = true;

			gapi.auth.authorize(
				{
					client_id: '591813156610.apps.googleusercontent.com',
					immediate: false,
					response_type: 'token',
					scope: [
						"https://www.googleapis.com/auth/plus.login",
						"https://www.googleapis.com/auth/userinfo.email",
						"https://www.googleapis.com/auth/userinfo.profile",
						"https://www.googleapis.com/auth/drive",
						"https://www.googleapis.com/auth/drive.install"
					]
				},
				app.modules.user.functions.manual_google_callback
			);
		},

		logged_in: function (event) {
			var module = app.modules.guest;
			if (module.aquired) {
				module.aquired = false;
				app.notify({ type: 'guest_aquired' });
			}
		}
	}
}