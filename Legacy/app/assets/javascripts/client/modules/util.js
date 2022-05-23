app.modules.util = {
  init: function () {},

  post_init: function () {
    app.notify({type: "module_ready", data: {name: "util"}});
  },

  actions: {},

  functions: {
    create_repeater: function(template, data) {
      var repeater = {
        parent: template.parent(),
        template: template,
        data: data,
        update: function (new_data) {
          if(new_data){
            this.data = new_data;
          }

          if(this.hasOwnProperty("prev")){
            this.prev.after(this.template);
          }else if(this.hasOwnProperty("next")){
            this.next.before(this.template);
          }else{
            this.parent.append(this.template);
          }

          //remove old instances
          for(var i = 0; i < this.instances.length; i++) {
            this.instances[i].remove();
          }

          //add new instances
          this.instances = app.modules.util.functions.repeat_template(this.template, this.data);
        },

        instances: []
      };

      if(template.prev().length > 0) {
        repeater.prev = template.prev();
      }else if(template.next().length > 0){
        repeater.next = template.next();
      }

      return repeater;
    },


    repeat_template: function(template, data) {
      var parent = template.parent();
      template.removeAttr("id");
      var instances = [];

      function replace_bindings(text, data){
        var bind_start = -1, bind_end = -1;

        //replace eval data bindings
        while( (bind_start = text.indexOf("((") ) > -1){
          if( (bind_end = text.indexOf("))", bind_start) ) > -1) {
              var bind_str = text.substring(bind_start + 2, bind_end);
              var datum = eval(bind_str);
            if(datum) {
              text = text.substring(0, bind_start) + datum + text.substring(bind_end + 2);
            }else {
              text = text.substring(0, bind_start) + text.substring(bind_end + 2);
            }
          }
        }

        //replace local data bindings
        while( (bind_start = text.indexOf("{{") ) > -1){
          if( (bind_end = text.indexOf("}}", bind_start) ) > -1) {

            var bind_str = text.substring(bind_start + 2, bind_end);
            var bind_parts = bind_str.split(".");
            var bind = bind_parts[bind_parts.length - 1];

            var data_level = data;

            for(var i = 0; i < bind_parts.length; i++){
                if(data_level.hasOwnProperty(bind_parts[i])){
                    data_level = data_level[bind_parts[i]];
                }else{
                    break;
                }
            }

            if( i ==  bind_parts.length) {
                var datum = data_level;
                if(bind == "date") {
                    datum = app.modules.util.functions.format_date(new Date(data[bind]));
                }
              text = text.substring(0, bind_start) + datum + text.substring(bind_end + 2);
            }else {
              text = text.substring(0, bind_start) + text.substring(bind_end + 2);
            }
          }
        }
        return text;
      }

      for(var i = 0; i < data.length; i++) {
        var element = template.clone().removeClass('invisible');

        data[i]["repeater-index"] = i;

        //replace bindings in attributes
        var attrs = element[0].attributes;
        for(var j = 0; j < attrs.length; j++){
          var value = attrs.item(j).nodeValue;
          element.attr(attrs.item(j).nodeName, replace_bindings(value, data[i]));
        }


        //repeat for sublists:
        element.find('[for]').each(function () {
            var sub_template = $(this);
            var for_attr = sub_template.attr('for');

            if(data[i].hasOwnProperty(for_attr)) {
                app.modules.util.functions.repeat_template(sub_template, data[i][for_attr]);
            }
        });


        //replace bindings in the inner html
        element.html( replace_bindings(element.html(), data[i]));
        template.before(element);
        instances.push(element);
      }

      template.detach();
      return instances;
    },

    get_close_elements: function (element, direction, blocking_classes, skip_classes) {
      var fields = [];
      var next_function = direction == 'right' ? 'next' : 'prev';
      var next = element[next_function]();

      while(next.length > 0){
        var next_classes = next.attr('class');
        if(!next_classes.match(blocking_classes)){
          if(skip_classes){
            if(!next_classes.match(skip_classes)) fields.push(next);
          }else{
            fields.push(next);
          }
          next = next[next_function]();
        }else{
          break;
        }
      }

      return fields;
    },

    get_elements_between: function (a, b) {
      var elements = [];
      var children = a.parent().children();

      var a_index = children.index(a);
      var b_index = children.index(b);

      var start = null, end = null;
      if(a_index <= b_index){
        start = a_index;
        end = b_index;
      }else{
        start = b_index;
        end = a_index;
      }

      for(var i = start + 1; i < end; i++)
        elements.push(children.eq(i));

      return elements;
    },

    format_date: function(date) {
      var minutes = date.getMinutes();
      if(minutes < 10) {
        minutes = "0" + minutes;
      }
      var date_string = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substring(2,4) + " " + date.getHours() + ":" + minutes;
      return date_string;
    },

    compare_objects: function (obj1, obj2){
      var match = true;
      $.each(obj1, function (key, value) {
        if(!obj2.hasOwnProperty(key))
          match = false;
        else if(obj2[key] != obj1[key])
          match = false;
      });
      return match;
    },

    dist2: function (a, b) {
      return Math.pow(a.left - b.left, 2) + Math.pow(a.top - b.top, 2);
    }
  }
}