/* global app $ */

app.modules.history = {
	init: function () {
		var module = app.modules.history;
		module.steps = [];
		module.position = 0;
		module.limit = 500;
		app.notify({type: 'module_ready', data: {name: 'history'}});
	},

	actions: {
		create_restore_point: function () {
			var module = app.modules.history;
			var steps = module.steps;
			var note_body = app.modules.editor_ui.note_body;

			while(module.position > 0) {
				module.position--;
				steps.pop();
			}
			var tmp = $('<div>');
			tmp.html(note_body.html());
			tmp.find('#autocomplete').remove();
			steps.push(tmp.html());
		},

		undo_tap: function () {
			var module = app.modules.history;
			var steps = module.steps;
			var note_body = app.modules.editor_ui.note_body;

			if(module.position == 0) {
				app.notify({type: 'create_restore_point'});
				module.position = 1;
			}

			if(steps.length - module.position > 0 && module.position < module.limit){
				module.position++;
				note_body.html(steps[steps.length - module.position]);
			}
			app.notify({type: 'restored_from_history'});
		},

		redo_tap: function () {
			var module = app.modules.history;
			var steps = module.steps;
			var note_body = app.modules.editor_ui.note_body;
			if(module.position > 1){
				module.position--;
				note_body.html(steps[steps.length - module.position]);
			}
			app.notify({type: 'restored_from_history'});
		},

		note_ready: function () {
			var module = app.modules.history;
			module.steps = [];
			module.position = 0;
		}
	}
};
