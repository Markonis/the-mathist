app.modules.logger = {
    init: function () {
        app.notify({type: 'module_ready', data: {name: 'logger'}});
    },

    actions: {
        open_file: function () {
            app.modules.logger.functions.log({event: 'drive_request'});
        },

        save_file: function () {
            app.modules.logger.functions.log({event: 'drive_request'});
        },

        confirm_delete_file: function () {
            app.modules.logger.functions.log({event: 'drive_request'});
        }
    },

    functions: {
        log: function (data) {
            $.ajax({
                url: '/client/log',
                type: 'POST',
                data: JSON.stringify(data),
                success: function (response) {
                    if(response.status) {
                        //console.log('Drive request successfully logged.');
                    }
                }
            })
        }
    }
}