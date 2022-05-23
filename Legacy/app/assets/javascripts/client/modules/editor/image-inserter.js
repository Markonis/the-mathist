/* global app $ */

app.modules.image_inserter = {
  init: function() {
    var module = app.modules.image_inserter;
    module.dialog = $('#image-upload-dialog');
    module.preloader = $('#image-upload-preloader');
    module.message = $('#image-uploader-message');

    $('#close-image-upload-btn').on('tap', function() {
      app.notify({type: 'cancel_file_upload'});
    });

    app.notify({type: 'module_ready', data:{name: 'image_inserter'}});
  },

  actions: {
    insert_image_tap: function() {
      var module = app.modules.image_inserter;
      module.functions.reset();
      app.notify({type: 'open_dialog_tap', data: {dialog: module.dialog}});
    },

    upload_files_selected: function(event) {
      var module = app.modules.image_inserter;
      var files = module.functions.filter_image_files(event.data.files);
      var input = event.data.input;
      if(input.parents('#image-upload-dialog').length == 1){
        if(files.length > 0){
          module.functions.show_preloader();
          module.functions.hide_message();
          app.notify({type: 'upload_files', data: {
            input: input, files: files,
            url: 'client/images/upload'
          }});
        }else{
          module.functions.show_message('Please select an image file.');
        }
      }
    },

    file_upload_success: function(event) {
      var module = app.modules.image_inserter;
      var files = event.data.files;
      var files_data = event.data.files_data;
      for(var i = 0; i < files.length; i++){
        var type = files[i].type;
        var data = files_data[i];
        module.functions.insert_image(type, data);
      }
      app.notify({type: 'close_dialog_tap'});
    },

    file_upload_error: function(event) {
      var module = app.modules.image_inserter;
      module.functions.show_message('Oops! There was an error uploading the image.');
      module.preloader.addClass('invisible');
    }
  },

  functions: {
    filter_image_files: function(files) {
      var result = [];
      for(var i = 0; i < files.length; i++){
        if(files[i].type.match('image.*') != null){
          result.push(files[i]);
        }
      }
      return result;
    },

    insert_image: function(type, data) {
      var manipulator = app.modules.manipulator;
      var editor = app.modules.editor;

      var src = 'data:' + type + ';base64,' + data;
      var image = $('<img>').attr('src', src);
      var simple_field = $('<div class="simple-field v-centered"></div>');
      image.width(320);
      simple_field.append(image);
      manipulator.functions.append_to(simple_field);
      editor.functions.write_element(simple_field);
    },

    show_message: function(text) {
      var module = app.modules.image_inserter;
      module.message.removeClass('invisible').text(text);
    },

    hide_message: function() {
      var module = app.modules.image_inserter;
      module.message.addClass('invisible').text('');
    },

    show_preloader: function() {
      var module = app.modules.image_inserter;
      module.preloader.removeClass('invisible');
    },

    hide_preloader: function() {
      var module = app.modules.image_inserter;
      module.preloader.addClass('invisible');
    },

    reset: function() {
      var module = app.modules.image_inserter;
      module.functions.hide_preloader();
      module.functions.hide_message();
    }
  }
};
