app.modules.files_ui = {
	init: function () {
		var module = app.modules.files_ui;

		module.list = [];
		module.prev_folders = [];
		module.repeater = null;
		module.confirm_delete_dialog = $('#confirm-file-delete-dialog');
		module.confirm_delete_btn = $('#confirm-file-delete');

		var home_container = app.modules.home.home_container;
		home_container.on('tap', '#notes .file', function (event) {
			if(!$(event.target).hasClass('delete-note')){
				var file_info = JSON.parse(decodeURIComponent($(this).attr('file-info')));
				var title = $(this).attr('title');
				var parent_id = module.prev_folders[module.prev_folders.length - 1];
				app.notify({type: 'file_tap', data: {file_info: file_info, parent_id: parent_id, title: title}});
			}
		});

		home_container.on('tap', '#notes .folder', function (event) {
			app.notify({type: 'folder_tap', data: {file_info: JSON.parse(decodeURIComponent($(this).attr('file-info')))}});
		});

		home_container.on('tap', '.prev-folder', function (event) {
			app.notify({type: 'prev_folder_tap'});
		});

		$('#new-note').on('tap', function () {
			var parent_id = module.prev_folders[module.prev_folders.length - 1];
			app.notify({type:"new_note_tap", data:{parent_id: parent_id}});
		});

		$('#notes').on('tap', '.delete-note.btn', function () {
			app.notify({type: "delete_file_tap", data: {file_info: $(this).attr('file-info')}});
		});

		module.confirm_delete_btn.on('tap', function () {
			app.notify({type: "confirm_delete_file", data: {file_info: JSON.parse(decodeURIComponent($(this).attr('file-info')))}});
			app.notify({type: "close_dialog_tap"});
		});

		$('#cancel-file-delete').on('tap', function () {
			app.notify({type: "close_dialog_tap"});
		});

		$('#search').on('keyup', function () {
			app.notify({type: 'search_changed', data:{query: $(this).val()}});
		});

		module.repeater = app.modules.util.functions.create_repeater($('#file-template'), []);
	},

	actions: {
		logged_in: function () {
			app.notify({type: 'load_files', data:{file_info: {id: 'root'}}});
		},

		guest_logged_in: function () {
			app.notify({type: 'module_ready', data: {name: 'files_ui'}});
		},

		files_loaded: function(event){
			var module = app.modules.files_ui;
			var files = event.data.files;

			for(var i = 0; i < files.length; i++) {
				files[i].file_info = encodeURIComponent(JSON.stringify(files[i].file_info));
			};

			module.prev_folders.push(event.data.parent_id);
			if(module.prev_folders.length > 1) { //if count is more than one, add 'back' button
				files.splice(0, 0, {type: 'prev-folder', title: 'Back', file_info: encodeURIComponent('{}')});
			}

			if(event.data.parent_id == 'sharedWithMe')
				$('#new-note').addClass('invisible')
			else
				$('#new-note').removeClass('invisible');



			app.modules.files_ui.repeater.update(files);
			app.notify({type: 'module_ready', data: {name: 'files_ui'}});
		},

		file_tap: function () {
			$('#search').val('');
		},

		folder_tap: function(event) {
			$('#search').val('');
			app.notify({type: 'load_files', data: {file_info: event.data.file_info}});
		},

		prev_folder_tap: function(event){
			var module = app.modules.files_ui;
			$('#search').val('');
			module.prev_folders.pop();
			app.notify({type: 'load_files', data: {file_info: {id: module.prev_folders.pop()}}});
		},

		file_saved: function () {
			var module = app.modules.files_ui;
			// Refresh the folder of the current file
			app.notify({type: 'load_files', data: {file_info: {id: module.prev_folders[module.prev_folders.length -1]}}});
		},

		delete_file_tap: function (event) {
			var module = app.modules.files_ui;
			module.confirm_delete_btn.attr('file-info', event.data.file_info);
			app.notify({type: "open_dialog_tap", data:{dialog: app.modules.files_ui.confirm_delete_dialog}})
		},

		file_deleted: function(event){
			var module = app.modules.files_ui;
			var file_info = event.data.file_info;
			var new_list = [];
			var list = module.repeater.data;

			for(var i = 0; i < list.length; i++) {
				if(!app.modules.util.functions.compare_objects(file_info, JSON.parse(decodeURIComponent(list[i].file_info)))) {
					new_list.push(list[i]);
				}
			}

			module.repeater.update(new_list);
		},

		search_changed: function (event) {
			$('.file, .folder').each(function () {
				var label = $(this).text().toLowerCase();
				if(label.indexOf(event.data.query.toLowerCase()) > -1){
					$(this).removeClass('invisible');
				}else{
					$(this).addClass('invisible');
				}
			});
		}
	}
}
