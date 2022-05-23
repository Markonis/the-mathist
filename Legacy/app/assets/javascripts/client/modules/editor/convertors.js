/* global app $ */

app.modules.convertors = {
  init: function () {
    app.modules.convertors.conversions = [

      function (body) {
        body.find('#caret').remove();
      },

      function (body) { // Converts images hosted in database to base64 encoded on page
        body.find('.image-container .img').each(function () {
          var image_div = $(this);
          var image_url = image_div.css('background-image');

          //clean the url
          var from_start = 4;
          if(image_url.charAt(4) == "\""){
            from_start++;
          }
          var from_end = 1;
          if(image_url.charAt(image_url.length - 2) == "\""){
            from_end++;
          }

          image_url = image_url.substring(from_start);
          image_url = image_url.substring(0, image_url.length - from_end);

          //find the index of the 3. forward slash in the url
          for(var i = 0, pos = 0, num = 0; i < image_url.length && num < 3; i++){
            if(image_url.charAt(i) == "/"){
              pos = i;
              num++;
            }
          }

          //if the image comes from wolframalpha.com
          if(image_url.indexOf("wolframalpha.com") == pos - 16){
            $.ajax({
              type: 'POST',
              url: 'client/images/download',
              data: JSON.stringify({url: image_url}),
              success: function (response){
                console.log(response);
                if(response.status){
                  image_div.css('background-image', 'url("data:image/gif;base64,' + response.data.image_data + '")');
                }
              }
            });
          }

          //if the image comes from themathist.com
          if(image_url.indexOf("themathist.com") == pos - 14){
            $.ajax({
              type: 'GET',
              url: image_url.substring(pos + 1),
              success: function (response) {
                console.log(response);
                if(response.status){
                  image_div.css('background-image', 'url("data:image/gif;base64,' + response.data.image_data + '")');
                }
              }
            })
          }
        });
      },

      function (body) {
        //convert the root radix to stretched
        body.find('.radix').each(function () {
          $(this).addClass('stretched');
        });

        //convert brackets
        body.find('.bracket').each(function () {
          var $this = $(this);
          var parent = $this.parent();

          if($this.hasClass('round')){
            $this.removeClass('round').addClass('stretched');
            if($this.hasClass('left')){
              $this.text('(');
            }else{
              $this.text(')');
            }
            parent.addClass('round');
          }else if($this.hasClass('square')){
            $this.removeClass('square');
            parent.addClass('square');
          }else {
            parent.addClass('straight');
          }

          $this.removeClass('bracket');
        });
      },

      function (body) { // Transition to editor 2.0
        var punctuation = [',', '.', '?', ':', ';', '⋯'];
        var tmp = $('<div>');
        tmp.html(body.html());
        body.html('');

        var br_template = $('<br class="simple-field line-break">');

        function add_text(text) {
          text = text.substring(0, text.length - 1); // Remove the (X)
          var template = $('<div class="simple-field">');
          for(var i = 0; i < text.length; i++){
            if(text[i] == ' ')
              body.append(template.clone().addClass('space'));
            else if(punctuation.indexOf(text[i]) > -1)
              body.append(template.clone().text(text[i]).addClass('punctuation'));
            else
              body.append(template.clone().text(text[i]));
          }
          body.append(br_template.clone());
          body.append(br_template.clone());
        }

        function add_image(image) {
          if(image.prop("tagName").toLowerCase() == 'svg'){
            body.append($('<div class="bordered padded light gray simple-field svg-placeholder">Drawing will be here soon...</div>').append(image));
          }else{
            var src = image.css('background-image').trim();
            src = src.substring(4, src.length - 1);
            if(src[0] == '"') src = src.substring(1, src.length - 1);
            body.append($('<img>').attr('src', src).addClass('simple-field'));
          }
          body.append(br_template.clone());
          body.append(br_template.clone());
        }

        function convert_field(field){
          field.css('padding-top', 0);

          field.children().each(function () {
            var $this = $(this);
            $this.css('bottom', 0);

            if($this.hasClass('simple-field')){

              // Add simple field classes based on their text
              if(punctuation.indexOf($this.text()) > -1)
                $this.addClass('punctuation');

              else if(['=', '≠', '≈', '≉', '≃', '≄', '≅', '≆', '>', '<', '≫', '≪', '≥', '≤', '≡', '+', '±', '-', '∓', '×', '⋅', '∝', '%', '∣', '∤'].indexOf($this.text()) > -1)
                $this.addClass('operator')

              else if(['¬', '∧', '∨', '⊻', '⇒', '⇔', '∴', '∵', '∀', '∃', '∄', '⊤', '⊥', '⊢'].indexOf($this.text()) > -1)
                $this.addClass('logic');

              else if(['⊂', '⊃', '⊆', '⊇', '∩', '∪', '∈', '∉', '∌', '∅'].indexOf($this.text()) > -1)
                $this.addClass('sets')

              else if(['∞', '\'', '∂', '∇'].indexOf($this.text()) > -1)
                $this.addClass('calculus')


            }else if($this.hasClass('complex-field')){
              // Add required classes
              if($this.hasClass('fraction')){
                $this
                .addClass('two-storey margin-field')
                .children().first().after($('<div class="aligner">'));

              }else if($this.hasClass('radial')){
                if(
                  $this.hasClass('summation') ||
                  $this.hasClass('product')   ||
                  $this.hasClass('logarithm') ||
                  $this.hasClass('integral')  ||
                  $this.hasClass('limit')
                ){
                  $this.addClass('two-storey');
                }else{
                  $this.children('.radial-c').addClass('pass-through');
                }

                $this.children('.radial-c').addClass('aligner crucial');
              }

              // Add order attributes
              if($this.hasClass('summation') || $this.hasClass('product') || $this.hasClass('limit')){

                if($this.hasClass('limit')) {
                  $this.children('.radial-t').remove();
                  var bottom_field = $this.children('.radial-b');
                  bottom_field.attr('class', 'complex-field');
                  bottom_field.children('.simple-field').attr('class', 'inline');
                }

                $this.removeClass('radial');
                $this.children('.radial-t').attr('order', '2').removeClass('radial-t');
                $this.children('.radial-b').attr('order', '1').removeClass('radial-b').addClass('crucial');
                $this.children('.radial-tr, .radial-br').remove();
                $this.children('.radial-c').removeClass('radial-c');
              }else if($this.hasClass('integral')){
                $this.children('.radial-tr').attr('order', '2');
                $this.children('.radial-br').attr('order', '1');
              }else if($this.hasClass('root')){
                $this.addClass('margin-field');
              }else{
                $this.children('.radial-t').attr('order', '1');
                $this.children('.radial-tr').attr('order', '4');
                $this.children('.radial-c').attr('order', '2');
                $this.children('.radial-br').attr('order', '5');
                $this.children('.radial-b').attr('order', '3');
              }

              // Convert recursively
              $this.children('.field').each(function(){
                convert_field($(this));
              })
            }
          })
        }

        // Convert page elements
        tmp.find('.page-element-container').each(function () {
          var $this = $(this);

          if($this.hasClass('text-area-container')){
            add_text($this.text());

          }else if($this.hasClass('image-container')){
            add_image($this.children().first());

          }else if($this.hasClass('formula-container')){
            var formula = $this.children().first();
            convert_field(formula);
            body.html(body.html() + formula.html());
            body.append(br_template.clone());
            body.append(br_template.clone());
          }
        });

        // Create words
        var word_content = [];
        body.children().each(function () {
          var child = $(this);
          var is_word_separator =
            child.hasClass('punctuation') ||
            child.hasClass('space') ||
            child.hasClass('line-break') ||
            child.hasClass('complex-field') ||
            child.hasClass('operator') ||
            child.hasClass('logic') ||
            child.hasClass('sets') ||
            child.hasClass('calculus');

          if(!is_word_separator){
            word_content.push(child);
          }else if(word_content.length > 0){
            var word = $('<div class="complex-field word">');
            var word_field = $('<div class="crucial pass-through field">');
            word_content[0].before(word);
            word.append(word_field);

            for(var i = 0; i < word_content.length; i++)
              word_field.append(word_content[i]);

            word_content = [];
          }
        });
      },

      function (body) { // Add manipulator to images and geogebra
        var manipulator_template = $(
          '<div class="absolute manipulator">' +
            '<div class="absolute manipulator-handle n-handle"></div>' +
            '<div class="absolute manipulator-handle e-handle"></div>' +
            '<div class="absolute manipulator-handle s-handle"></div>' +
            '<div class="absolute manipulator-handle w-handle"></div>' +
            '<div class="absolute manipulator-handle ne-handle"></div>' +
            '<div class="absolute manipulator-handle se-handle"></div>' +
            '<div class="absolute manipulator-handle sw-handle"></div>' +
            '<div class="absolute manipulator-handle nw-handle"></div>' +
          '</div>');

        body.find('img.simple-field').each(function () {
          var new_image = $(this).clone();
          new_image.removeClass('simple-field');

          var simple_field = $('<div class="simple-field v-centered"></div>');
          simple_field.append(new_image);

          var manipulator = manipulator_template.clone();
          simple_field.append(manipulator);

          $(this).after(simple_field);
          $(this).remove();
        });

        body.find('.geogebra.simple-field').each(function () {
          var simple_field = $(this);
          var manipulator = manipulator_template.clone();
          var id = simple_field.html().match(/\/id\/(.+)\/width\//)[1];
          simple_field.attr('geogebra-id', id);
          simple_field.append(manipulator);
        });
      }
    ];

    app.notify({type: 'module_ready', data: {name: 'convertors'}});
  },

  actions: {
    file_parsed: function (event) {
      var module = app.modules.convertors;
      var file = event.data;
      var conversions = app.modules.convertors.conversions;
      var body = $('<div>').html(file.body);

      // Run conerter functions
      for(var i = file.meta.editor_version; i < conversions.length; i++)
        conversions[i](body);

      // Notify with converted body
      var data = {
        body: body.html(),
        title: file.title,
        meta: file.meta
      }

      app.notify({type: 'note_ready', data: data});
    }
  }
}