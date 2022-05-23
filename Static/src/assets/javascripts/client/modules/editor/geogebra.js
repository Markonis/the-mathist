/* global app $ */

app.modules.geogebra = {
  init: function () {
    var module = app.modules.geogebra;

    module.results = [];
    module.current_result_index = null;

    module.result = $('#geogebra-result');
    module.result_title = $('#geogebra-result-title');
    module.result_image = $('#geogebra-result-image');
    module.paging = $('#geogebra-paging');
    module.preloader = $('#geogebra-preloader');

    module.result.on('click', function () {
      app.notify({type: 'geogebra_result_chosen'});
    });

    module.dialog = $('#geogebra-dialog');
    app.notify({type: 'module_ready', data: {name: 'geogebra'}});
  },

  actions: {
    geogebra_tap: function (event) {
      var module = app.modules.geogebra;
      app.notify({type: "open_dialog_tap", data: {dialog: module.dialog}});
    },

    search_geogebra: function() {
      var module = app.modules.geogebra;
      var query = $('#geogebra-query').val();
      $.ajax({
        url: '/client/geogebra/search',
        type: 'POST',
        data: JSON.stringify({query: query, limit: 20}),
        success: function (result) {
          if(result.status){
            console.log(result);
            module.functions.update_results(result.data);
          }
        }
      });
      module.preloader.removeClass('invisible');
      module.result.addClass('invisible');
      module.paging.addClass('invisible');
    },

    previous_geogebra_result: function() {
      var module = app.modules.geogebra;
      var index = module.current_result_index;
      if(index > 0) {
        module.functions.show_result(index - 1);
      }
    },

    next_geogebra_result: function() {
      var module = app.modules.geogebra;
      var index = module.current_result_index;
      if(index < module.results.length - 1) {
        module.functions.show_result(index + 1);
      }
    },

    geogebra_result_chosen: function () {
      var module = app.modules.geogebra;
      var index = module.current_result_index;
      var current_result = module.results[index];
      var note_element = module.functions.result_note_element(current_result);
      var editor = app.modules.editor;
      editor.formula_mode = true;
      app.notify({type: 'end_key_press'});
      app.notify({type: 'add_new_line'});
      app.modules.editor.functions.write_element(note_element);
      editor.formula_mode = false;
    },

    manipulation_finished: function(event) {
      var module = app.modules.geogebra;
      var manipulated = event.data.manipulated;
      var manipulated_parent = manipulated.parent();
      if(manipulated_parent.hasClass('geogebra')){
        module.functions.resize(manipulated_parent, manipulated.width(), manipulated.height());
      }
    }
  },

  functions: {
    update_results: function(results) {
      var module = app.modules.geogebra;
      module.results = results;
      module.functions.show_result(0);
      module.preloader.addClass('invisible');
    },

    show_result: function(index) {
      var module = app.modules.geogebra;
      module.current_result_index = index;

      var current_result = module.results[index];
      module.result_title.text(current_result.title);
      module.result_image.css('background-image',
        'url(' + current_result.thumbnail + ')');

      module.result.removeClass('invisible');
      module.paging.removeClass('invisible');
    },

    result_note_element: function (result) {
      var module = app.modules.geogebra;
      var simple_field = $('<div class="geogebra simple-field" geogebra-id="' + result.id + '">');
      app.modules.manipulator.functions.append_to(simple_field);
      var iframe_html = module.functions.iframe_html(result.id, 640, 320);
      var iframe = $(iframe_html);
      simple_field.append(iframe);
      return simple_field;
    },

    iframe_html: function(id, width, height) {
      return '<iframe scrolling="no" src="https://www.geogebra.org/material/iframe' +
        '/id/' + id +
        '/width/' + width +
        '/height/'+ height +
        '/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"' +
        'width="' + width+ 'px" ' +
        'height="' + height + 'px"' +
        '></iframe>';
    },

    resize: function(simple_field, width, height) {
      var module = app.modules.geogebra;
      var id = simple_field.attr('geogebra-id');
      simple_field.children().remove('iframe');
      var iframe_html = module.functions.iframe_html(id, width, height);
      var iframe = $(iframe_html);
      simple_field.append(iframe);
    }
  }
};
