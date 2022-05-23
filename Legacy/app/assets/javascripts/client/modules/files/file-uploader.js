/* global app $ */

app.modules.file_uploader = {
  init: function() {
    var module = app.modules.file_uploader;
    module.functions.init_file_inputs();
    module.in_progress = false;
    app.notify({type: 'module_ready', data:{name: 'file_uploader'}});
  },

  actions: {
    upload_files: function(event) {
      var module = app.modules.file_uploader;

      var input = event.data.input;
      var files = event.data.files;
      var data = module.functions.create_form_data(files);

      module.in_progress = true;

      $.ajax({
        url: event.data.url,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
          if(response.status == true) {
            input.val('');
            if(module.in_progress) {
              app.notify({type: 'file_upload_success', data: {
                input: input, files: files,
                files_data: response.data.files_data
              }});
            }
          }else{
            input.val('');
            if(module.in_progress) {
              app.notify({type: 'file_upload_error', data: {
                input: input, files: files
              }});
            }
          }
        }
      });
    },

    file_upload_success: function() {
      var module = app.modules.file_uploader;
      module.in_progress = false;
    },

    file_upload_error: function() {
      var module = app.modules.file_uploader;
      module.in_progress = false;
    },

    cancel_file_upload: function() {
      var module = app.modules.file_uploader;
      module.in_progress = false;
      module.functions.clear_all_inputs();
    }
  },

  functions: {
    create_form_data: function(files) {
      var data = new FormData();
      for(var i = 0; i < files.length; i++) {
        data.append('files[]', files[i]);
      }
      data.append('test', 'marko');
      return data;
    },

    init_file_inputs: function() {
      $('input[type="file"]').each(function () {
        var input = $(this);
        input.on('change', function(event) {
          app.notify({type: 'upload_files_selected', data: {
            input: input, files: event.target.files
          }});
        });
      });
    },

    clear_all_inputs: function() {
      $('input[type="file"]').each(function () {
        $(this).val('');
      });
    }
  }
};
