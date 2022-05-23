/* global app $ */

app.modules.editor_tutorial = {
  init: function () {
    var module = app.modules.editor_tutorial;
    module.dialog = $('#editor-tutorial-dialog');
    app.notify({type: 'module_ready', data: {name: 'editor_tutorial'}});
  },

  actions: {
    show_tutorial: function () {
      var module = app.modules.editor_tutorial;
			app.notify({type: 'open_dialog_tap', data: {dialog: module.dialog}});
    },

    deeplink_match: function (event) {
      var user = app.modules.user;
      var params = event.data.params;
      if(params.page == 'guest') {
        app.notify({type: 'show_tutorial'});
      }else if(params.page == 'editor') {
        if(!user.config.watched_tutorial) {
          app.notify({type: 'show_tutorial'});
        }
      }
    }
  }
};
