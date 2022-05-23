/* global app $ */
app.modules.demo_requests = {
  init: function () {
    var module = app.modules.demo_requests;
    module.dialog = $('#promo-dialog');
    app.notify({type: 'module_ready', data: {name: 'demo_requests'}});
  },

  actions: {
    logged_in: function() {
      var module = app.modules.demo_requests;
      if(module.functions.should_hide_promo()) {
        $('#promo-container').addClass('invisible');
      }
    },

    promo_tap: function() {
      var module = app.modules.demo_requests;
      app.notify({type: 'open_dialog_tap', data: {dialog: module.dialog}});
    },

    schedule_demo_tap: function () {
      window.location.href = "http://demo.themathist.com";
    }
  },

  functions: {
    should_hide_promo: function () {
      var user = app.modules.user;
      return user.additional_data.demo_requests.length > 0;
    }
  }
};