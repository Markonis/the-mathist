app.modules.gdrive = {
	init: function (){
		app.notify({type: 'module_ready', data: {name: 'gdrive'}});
	},
	
	actions:{

		//always check in the action if the user is a google user
		load_files: function(event){
			if(app.modules.user.session.provider != 0)
				return;
			app.modules.gdrive.functions.retrieve_files(event);
		},
		
		open_file: function(event){
			if(app.modules.user.session.provider!=0)
				return;				
			app.modules.gdrive.functions.download_file(event);
		},
		
		save_file: function(event){
			if(app.modules.user.session.provider!=0)
				return;
			app.modules.gdrive.functions.save_file(event);
		},
		
		confirm_delete_file: function(event){	
			if(app.modules.user.session.provider!=0)
				return;
			app.modules.gdrive.functions.delete_file(event);
		},
		
		share_file: function(event){
			if(app.modules.user.session.provider!=0)
				return;
			
			s = new gapi.drive.share.ShareClient('591813156610.apps.googleusercontent.com');
        	s.setItemIds([event.data.file_info.id]);
        	s.showSettingsDialog();
		}
	},
	
	
	functions: {
		save_file: function(event){
			
			var id = event.data.file_info != null ? event.data.file_info.id : '';
			
			var title = event.data.title;
			var parent_id = event.data.parent_id;
			
			var metadata = {
			  'title': title,
			  'mimeType': 'application/themathist.note'
			};
			
			if(parent_id != "sharedWithMe")
				metadata['parents'] = [{id: parent_id}]

			//base 64 encode data
			var base64Data=null;			
			try{				
				//base64Data = window.btoa(content);
				base64Data = window.btoa(encodeURIComponent( event.data.content ));
			}catch(e){
				console.log(e);
				console.log(content);
				app.notify({type: 'file_not_saved'});
				return;
			}
			
			//construct the request body
			var boundary = '-------314159265358979323846';
			var delimiter = "\r\n--" + boundary + "\r\n";
			var close_delim = "\r\n--" + boundary + "--";
			
			var multipartRequestBody =
				delimiter +
				'Content-Type: application/json;\r\n\r\n' +
				JSON.stringify(metadata) +
				delimiter +
				'Content-Type: application/themathist.note \r\n' +
				'Content-Transfer-Encoding: base64\r\n' +				
				'\r\n' +
				base64Data +
				close_delim;
							
			
			//send request
			var request = gapi.client.request({
				'path': '/upload/drive/v2/files/'+id, //id is added for updating note, if new note, id ='';
				'method': id == '' ? 'POST' : 'PUT',//POST for new note, PUT for existing
				'params': {'uploadType': 'multipart'},
				'headers': {
				  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
				},
				'body': multipartRequestBody});
				
			request.execute(function (response){
				if(response.id){
					app.notify({type: "file_saved", data: {file: {title: title, parent_id: parent_id, 
					file_info: {id: response.id, download_url: response.downloadUrl}}}});					
				}else{
					app.notify({type: 'file_not_saved'});
				}
			});
		},
		
		retrieve_files: function(event) {			
			var file_info = event.data.file_info;
			
			//construct queries
			var base_query= "fields=items(downloadUrl, id, title)&maxResults=9999&q=" +
				"trashed = false and "; //the actual query
		
			if(file_info.id == 'sharedWithMe')
				base_query += 'sharedWithMe and ';
			else
				base_query += "'" + file_info.id + "' in parents and ";
		
			var queries = [
				base_query + "mimeType = 'application/vnd.google-apps.folder'", //folders
				base_query + "mimeType = 'application/themathist.note'" //notes
			];

			//execute queries
			for(var i = 0; i < queries.length; i++){
				var request = gapi.client.request({
					'path': '/drive/v2/files?' + queries[i],
					'method': 'GET'
				});
						
				request.execute(function (resp) {
					if (typeof resp !== 'undefined' && typeof resp.items !== 'undefined') {
						var items = resp.items;
						
						if(items.length > 0){
							if(items[0].downloadUrl) { //check if we received folders or files
								for (var j = 0; j < items.length; j++){
									items[j].title = items[j].title;
									items[j]['type'] = 'file';
									var info = {id:items[j].id, download_url: items[j].downloadUrl};
									items[j]['file_info'] = info;
								}
							}else{								
								for(var j = 0; j < items.length; j++){
									items[j]['type'] = 'folder';
									var info = {id: items[j].id, download_url: null};
									items[j]['file_info'] = info;
								}
							}
						}							
						push_to_array(items);
					}else{
						app.notify({type: 'files_not_loaded'});
					}					
				});
			}
			
			//add to results
			var folders = [];
			var notes = [];									
			var count = 0;
			
			//add virtual folder for sharedWithMe
			if(file_info.id == 'root')
				folders.push({
					type: 'folder',
					title: 'Shared With Me',
					file_info: {id: 'sharedWithMe', downloadUrl: null}
				});
			
			//add regular results
			function push_to_array(file){
				for(var j = 0; j < file.length; j++)
					if(file[j].downloadUrl)
						notes.push(file[j]);
					else
						folders.push(file[j]);
				count++;
				if(count == queries.length)
					app.notify({type: 'files_loaded', data: {files: folders.concat(notes), parent_id: file_info.id}});
			}
		},
		
		download_file: function(event){
		
			var file_info = event.data.file_info;
			
			//construct the request
			var xhr = new XMLHttpRequest();
			xhr.open('GET', file_info.download_url);
			xhr.setRequestHeader('Authorization', 'Bearer ' + app.modules.user.session.token);
			xhr.setRequestHeader('Content-type','charset=UTF-8');
			xhr.onload = function() {
				if(xhr.status == 200) //success
					app.notify({type: 'file_opened', data:{content: decodeURIComponent(xhr.responseText)}});
				else
					app.notify({type: 'file_not_opened'});
			};
			
			xhr.onerror = function() {
				app.notify({type: 'file_not_opened'});
			};
			
			//send request
			xhr.send();
		},
		
		delete_file: function(event){
			
			var file_info = event.data.file_info;
			//construct the request
			var request = gapi.client.drive.files.delete({'fileId': file_info.id});
			//execute the request
			request.execute(function(resp) { 
				app.notify({type: 'file_deleted', data: {file_info: file_info}});
			});
		}
	}
}