/* global app gapi $ */

app.modules.user = {
  init: function () {
    var module = app.modules.user;
    module.session = null;
    module.config = {};
    module.logged_in = false;

    app.modules.app_ui.body.on('tap', '.log-out.btn', function () {
      app.notify({
        type: "log_out_tap"
      });
    });

    $('#guest-signin-btn').on('tap', function () {
      app.notify({
        type: "guest_logged_in"
      });
    });
  },

  post_init: function () {
    app.notify({ type: 'guest_logged_in', data: { name: 'guest' } })
  },

  functions: {
    setup_google_button: function () {
      function process_auth_result(auth_result) {
        if (!auth_result['access_token']) return;
        get_user_details(function (details) {
          var session = {
            provider: 0,
            token: auth_result.access_token,
            name: details.name,
            email: details.email,
            provider_user: details.provider_user,
            image_url: details.image_url
          };

          app.notify({
            type: "account_chosen",
            data: {
              session: session
            }
          });
        });
      }

      function get_user_details(success) {
        var parts_to_load = 2;
        var details = {
          name: null,
          provider_user: null,
          image_url: null
        };

        function detail_loaded_callback() {
          if (--parts_to_load == 0) success(details);
        }

        // Load name, user id and image url
        gapi.client.plus.people.get({
          'userId': 'me'
        }).execute(function (resp) {
          details.name = resp.displayName;
          details.provider_user = resp.id;
          details.image_url = resp.image.url.substring(0, resp.image.url.indexOf('?') + 1) + 'sz=200';
          detail_loaded_callback();
        });

        // Load email
        gapi.client.oauth2.userinfo.get().execute(function (resp) {
          if (resp['email']) {
            details.email = resp.email;
            detail_loaded_callback();
          }
        });
      }

      $('#google-signin-btn').on('tap', function () {
        gapi.auth.authorize({
          client_id: '591813156610.apps.googleusercontent.com',
          response_type: 'token',
          prompt: 'select_account',
          include_granted_scopes: true,
          authuser: "",
          scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.install"
          ]
        },
          process_auth_result
        );
      });
    },

    save_config: function () {
      var module = app.modules.user;
      $.ajax({
        type: 'POST',
        url: "client/save_config",
        data: JSON.stringify({
          config: JSON.stringify(module.config)
        }),
        success: function (response) {
          if (response.status) {
            app.notify({
              type: 'config_saved'
            });
          }
          else {
            app.modules.notifications.functions.show("Error");
          }
        }
      });
    },

    apply_config: function () {
      var config = app.modules.user.config;
      app.notify({
        type: "change_font_size",
        data: {
          size: config.font_size
        }
      });
    }
  },

  actions: {
    guest_logged_in: function () {
      app.notify({
        type: "close_dialog_tap"
      });
      app.notify({
        type: "module_ready",
        data: {
          name: "user"
        }
      });
    },

    guest_aquired: function () {
      var module = app.modules.user;
      module.config.transferred = true;
      module.functions.save_config();
    },

    log_out_tap: function () {
      gapi.auth.signOut();
      $.ajax({
        url: "client/log_out",
        success: function (response) {
          console.log(response);
          if (response.status) {
            window.location.assign("https://accounts.google.com/logout");
          }
          else {
            app.modules.notifications.functions.show("Error", "cross");
          }
        }
      });
    },

    confirm_delete_account: function () {
      $.ajax({
        url: "client/user",
        type: 'delete',
        success: function (response) {
          console.log(response);
          if (response.status) {
            window.location.assign("/index");
          }
          else {
            app.modules.notifications.functions.show("Error", "cross");
          }
        }
      });
    },

    send_feedback_tap: function (event) {
      $.ajax({
        type: 'POST',
        url: "client/send_feedback",
        data: JSON.stringify({
          content: event.data.text
        }),
        success: function (response) {
          console.log(response);
          if (response.status) {
            app.modules.notifications.functions.show("Feedback sent. Thank you!", "check");
          }
        }
      });
    },

    watched_tutorial: function () {
      var module = app.modules.user;
      module.config.watched_tutorial = true;
      if (module.logged_in) {
        module.functions.save_config();
      }
    },

    change_font_size: function (event) {
      var module = app.modules.user;
      module.config.font_size = event.data.size;
      module.functions.save_config();
    }
  }
};
