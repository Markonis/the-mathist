/* global app $ */

app.modules.notes = {

  init: function () {
    var module = app.modules.notes;
    module.current_file_info = null;
    module.current_file_parent_id = null;
    module.current_note_title = null;
    module.sync_in_progress = false;
    module.save_interval = null;
    module.delete_btn = $('#editor-container .delete-note.btn');
    module.search = $('#search');

    module.delete_btn.on('tap', function () {
      if(module.current_file_info){
        app.notify({type: "delete_file_tap", data: {file_info: JSON.stringify(module.current_file_info)}});
      }
    });
  },

  functions: {
    save_note: function () {
      var module = app.modules.notes;
      var editor_ui = app.modules.editor_ui;

      if(!module.sync_in_progress){

        app.notify({type: 'before_note_save'});

        var file_content = {
          meta: {
            editor_version: app.modules.convertors.conversions.length,
            is_homework: false,
            score: 1
          },
          body: module.functions.get_body()
        };

        var title = editor_ui.note_title.val();

        if(title != "" || file_content.body != ""){
          module.sync_in_progress = true;

          // Set empty title to Untitled
          title = title == '' ? 'Untitled' : title;
          module.current_note_title = title;

          app.notify({type: 'save_file', data: {
            title: title,
            content: JSON.stringify(file_content),
            file_info: module.current_file_info,
            parent_id: module.current_file_parent_id
          }});
        }
      }
    },

    get_body: function () {
      var temp = $('<div></div>');
      temp.html(app.modules.editor_ui.note_body.html());
      temp.find('.caret').remove();
      temp.find('#select').remove();
      temp.find('#autocomplete').remove();
      temp.find('#writing-tools').remove();
      temp.find('.page-element-container').removeClass('active');
      temp.find('.selection').remove();
      return temp.html();
    }
  },

  actions: {
    deeplink_match: function(event) {
      var params = event.data.params;
      var module = app.modules.notes;

      if(params.page == "editor"){
        if(!module.current_file_parent_id)
          app.functions.hash_change('home/notes');
      }else{
        if(module.save_interval != null) {
          clearInterval(module.save_interval);
          module.save_interval=null;
        }

        if(event.data.prev_page == "editor" && module.current_file_parent_id){
          module.functions.save_note();
        }

        //reset note data
        module.current_file_info = null;
        module.current_parent_id = null;
        module.current_note_title = null;
        module.sync_in_progress = false;

        app.notify({type: "module_ready", data: {name: "notes"}});
      }
    },

    file_tap: function (event) {
      var module = app.modules.notes;
      module.current_file_parent_id = event.data.parent_id;
      module.current_file_info = event.data.file_info;
      module.current_note_title = event.data.title;
      app.notify({type: "module_not_ready", data: {name: "notes"}});
      app.notify({type: 'open_file', data: {file_info: module.current_file_info}});
    },

    file_opened: function (event) {
      var module = app.modules.notes;
      var file_content = JSON.parse(event.data.content);
      app.functions.silent_hash_change('editor');
      app.notify({type: 'show_page', data:{page: 'editor'}});

      app.notify({type: 'file_parsed', data: {
        title: app.modules.notes.current_note_title,
        body: file_content.body,
        meta: file_content.meta
      }});

      module.sync_in_progress = false;
      module.save_interval = window.setInterval(module.functions.save_note, 15000); //autosave the note every 15s

      app.notify({type: "module_ready", data: {name: "notes"}});
    },

    guest_aquired: function () {
      var module = app.modules.notes;
      app.functions.silent_hash_change('editor');
      app.notify({type: 'show_page', data:{page: 'editor'}});

      module.current_file_parent_id = 'root';
      module.current_file_info = null;

      app.modules.notifications.functions.show('Note saved to Google Drive...', 'check');
      module.functions.save_note();
      module.sync_in_progress = false;
      module.save_interval = window.setInterval(module.functions.save_note, 15000); //autosave the note every 15s
    },

    file_not_opened: function () {
      app.modules.notifications.functions.show('Error opening file', 'cross');
    },

    new_note_tap: function (event) {
      var module = app.modules.notes;
      module.current_file_parent_id = event.data.parent_id;
      module.current_file_info = null;

      app.functions.silent_hash_change('editor');
      app.notify({type: 'show_page', data:{page: 'editor'}});

      module.sync_in_progress = false;
      module.save_interval = window.setInterval(module.functions.save_note, 15000); //autosave the note every 15s

      app.notify({type: "module_ready", data: {name: "notes"}});
    },

    file_saved: function (event) {
      var module = app.modules.notes;
      module.sync_in_progress = false;
      if(app.modules.deeplinking.current_page == "editor"){
        module.current_file_info = event.data.file.file_info;
      }
    },

    share_tap: function () {
      var module = app.modules.notes;
      if(module.current_file_info){
        app.notify({type: 'share_file', data: {file_info: module.current_file_info}});
      }
    },

    file_not_saved: function () {
      app.modules.notifications.functions.show('Error saving file', 'cross');
    },

    page_leave: function () {
      if(app.modules.deeplinking.current_page == "editor"){
        var module = app.modules.notes;
        module.functions.save_note();
      }
    },

    editor_reseted: function () {
      app.functions.hash_change('home/notes');
    }
  }
};
