/* global app $ */

app.modules.index_ui = {
  init: function () {
    var module = app.modules.index_ui;
    module.call_to_action = $('#call-to-action');
    module.main_container = $('#main-container');
    module.main_container_height = module.main_container.height();
    module.intro = $('#intro');
    module.intro_height = module.intro.height();

    $('#show-permissions-dialog').on('tap', function () {
      app.notify({type: "open_dialog_tap", data: {dialog: $('#permissions-dialog')}});
    });

    $('#start-now').on('tap', function () {
      app.notify({type: "start_now_tap"});
    });

    module.main_container.scroll(function () {
      app.notify({type: 'scrolled'});
    });
  },

  post_init: function () {
    app.notify({type: "module_ready", data: {name: "index_ui"}});
  },

  actions: {
    start_now_tap: function () {
      window.location.assign("/app");
    },

    scrolled: function () {
      var module = app.modules.index_ui;
      var scroll_top = module.main_container.scrollTop();
      var bottom = module.intro_height - module.main_container_height - scroll_top;
      bottom = Math.max(bottom, 0);
      module.call_to_action.css('bottom', bottom + 'px');
    },

    window_resize: function () {
      var module = app.modules.index_ui;
      module.main_container_height = module.main_container.height();
      module.intro_height = module.intro.height();
      app.notify({type: 'scrolled'});
    }
  }
};
