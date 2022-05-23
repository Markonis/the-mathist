/* global app Desmos $ */

app.modules.desmos = {
  init: function() {
    var module = app.modules.desmos;

    module.template = $('<div class="v-centered interactive simple-field desmos"></div>');
    module.calculators = [];

    app.notify({type: 'module_ready', data: {name: 'desmos'}});
  },

  actions: {
    desmos_tap: function() {
      var module = app.modules.desmos;
      var editor = app.modules.editor;

      app.notify({type: 'end_key_press'});
      app.notify({type: 'add_new_line'});

      var note_element = module.template.clone();
      app.modules.manipulator.functions.append_to(note_element);

      var wrapper = $('<div class="calculator-wrapper" style="width: 600px; height: 300px;"></div>');
      note_element.append(wrapper);

      editor.functions.write_element(note_element);

      var desmos_instance = Desmos.Calculator(wrapper[0], {keypad: false});
      module.functions.register(desmos_instance, note_element);
    },

    manipulation_finished: function(event) {
      var module = app.modules.desmos;
      var manipulated = event.data.manipulated;
      var manipulated_parent = manipulated.parent();
      if(manipulated_parent.hasClass('desmos')){
        for(var i = 0; i < module.calculators.length; i++){
          module.calculators[i].desmos_instance.resize();
        }
      }
    },

    field_tap: function() {
      app.modules.desmos.functions.unfocus_all();
    },

    math_container_tap: function () {
      app.modules.desmos.functions.unfocus_all();
    },

    create_restore_point: function () {
      app.modules.desmos.functions.save_all_states();
    },

    restored_from_history: function () {
      app.modules.desmos.functions.restore_all_states();
    },

    note_ready: function () {
      app.modules.desmos.functions.restore_all_states();
    },

    before_note_save: function () {
      app.modules.desmos.functions.save_all_states();
    }
  },

  functions: {
    register: function(desmos_instance, note_element) {
      var module = app.modules.desmos;
      module.calculators.push({
        desmos_instance: desmos_instance,
        note_element: note_element
      });
    },

    unfocus_all: function () {
      // Remove focus from all calculators
      var module = app.modules.desmos;
      for(var i = 0; i < module.calculators.length; i++){
        var instance = module.calculators[i].desmos_instance;
        instance.setState(instance.getState());
      }
    },

    clean_up: function() {
      var module = app.modules.desmos;
      module.calculators = module.calculators.filter(function (calc) {
        return $.contains(document, calc.note_element[0]);
      });
    },

    save_all_states: function () {
      var module = app.modules.desmos;
      module.functions.clean_up();
      for(var i = 0; i < module.calculators.length; i++){
        var calc = module.calculators[i];
        var note_element = calc.note_element;
        var new_json = JSON.stringify(calc.desmos_instance.getState());
        var old_json = note_element.attr('desmos-state');
        if(new_json != old_json) {
          note_element.attr('desmos-state', new_json);
        }
      }
    },

    restore_all_states: function () {
      var module = app.modules.desmos;
      module.calculators = [];
      $('.desmos .calculator-wrapper').html('');
      $('.desmos[desmos-state]').each(function () {
        var note_element = $(this);

        var wrapper = note_element.children('.calculator-wrapper');
        var desmos_instance = Desmos.Calculator(wrapper[0]);
        var state = JSON.parse(note_element.attr('desmos-state'));
        desmos_instance.setState(state);

        module.calculators.push({
          desmos_instance: desmos_instance,
          note_element: note_element
        });
      });
    }
  }
};
