(function() {
	/* 
    *   Backbone.sync from mootools-backbone by jeromegn
    */
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
    };

    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };

    /*
    *   return the url of the model (can be a function that return a string or a string)
    */

    var getUrl = function(object) {
        if (!(object && object.url)) return null;
        return (typeOf(object.url) == 'function') ? object.url() : object.url;
    };

    Composer.sync = function(method, model, options) {
        
        var type = methodMap[method];

        // Default JSON-request options.
        var params = Object.merge(options, {
            method: type,
            contentType:  'application/json',
            dataType:     'json',
            processData:  false
        });

        // Ensure that we have a URL.
        if (!params.url) {
            params.url = getUrl(model) || urlError();
        }

        // Ensure that we have the appropriate request data.
        if (!params.data && model && (method == 'create' || method == 'update')) {
            params.contentType = 'application/json';
            params.data = JSON.stringify(model.toJSON());
        }

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        if (Composer.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = params.data ? {model : params.data} : {};
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (Composer.emulateHTTP) {            
            if (type === 'PUT' || type === 'DELETE') {
                if (Backbone.emulateJSON) params.data._method = type;
                params.type = 'POST';
                params.beforeSend = function(xhr) {
                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
                };
            }
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !Composer.emulateJSON) {
            params.processData = false;
        }

        // make a JSON as default
        new Request.JSON(params).send();
    };
})();