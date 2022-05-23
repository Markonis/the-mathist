/* global $ gapi app */

app.modules.providers = {
  init: function() {
    var module = app.modules.providers;
    module.num_google_apis = 4;

    // Load Google client library
    window.google_client_loaded = function() {
      app.notify({
        type: 'google_client_loaded'
      });
    };
    $('body').append('<script src="https://apis.google.com/js/client.js?onload=google_client_loaded"></script>');
  },

  actions: {
    google_client_loaded: function() {
      var api_key = "AIzaSyAowTlGQzArjZ21Ha4i3ZdeoIc107RPGaE";
      gapi.client.setApiKey(api_key);

      setTimeout(function() {
        //load the google apis
        gapi.client.load('plus', 'v1', function() {
          app.notify({
            type: "google_api_loaded"
          });
        });

        gapi.client.load('oauth2', 'v2', function() {
          app.notify({
            type: "google_api_loaded"
          });
        });

        gapi.client.load('drive', 'v2', function() {
          app.notify({
            type: "google_api_loaded"
          });
        });

        gapi.load('drive-share', function() {
          app.notify({
            type: "google_api_loaded"
          });
        });

      }, 1);
    },

    google_api_loaded: function() {
      var module = app.modules.providers;
      module.num_google_apis--;
      if (module.num_google_apis == 0) {
        // All apis have loaded
        app.notify({
          type: "provider_loaded"
        });
      }
    },

    provider_loaded: function() {
      app.notify({
        type: "providers_loaded"
      });
      app.notify({
        type: "module_ready",
        data: {
          name: "providers"
        }
      });
    }
  }
};
