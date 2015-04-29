Watchis = {
    baseUrl: 'http://watch.is/api/',
    filters: {
        page: 1/*,
        genres: null,
        genresLogic: null,
        years: null,
        title: null,
        limit: 50*/
    },
    itemsListSuccessHandler: null,
    genresListSuccessHandler: null,
    infoSuccessHandler: null
};

Watchis.loginAndGetItemsList = function(username, password)
{
    var params = {
        username: username,
        password: password
    };
    Watchis.ajax(Watchis.baseUrl, Watchis.loginSuccess, params);
};

Watchis.getGenresList = function()
{
    Watchis.ajax(Watchis.baseUrl + 'genres/', Watchis.genresListSuccessHandler);
};

Watchis.getInfo = function(id) {
    var url = Watchis.baseUrl + 'watch/' + id;
    Watchis.ajax(url, Watchis.itemInfoProcessor);
};

Watchis.ajax = function(url, successHandler, params)
{
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.successHandler = successHandler;
    xhr.errorHandler = Main.errorHandler;
    xhr.onreadystatechange = Watchis.ajaxDone;
    params = params || {};

    if (params.username && params.password) {
        url += '?username=' + params.username + '&password=' + params.password;
        xhr.open('post', url);//, true);
        xhr.send(null);
    } else {
        xhr.open('get', url);
        xhr.send();
    }
};

Watchis.ajaxDone = function(event)
{
    var xhr = event.srcElement;
    if (xhr.readyState != 4) { return; }

    try {
        var parsedResponse = xhr.responseXML;
        if (parsedResponse == null) {
            return xhr.errorHandler('Got empty response');
        }
        var errorElement = parsedResponse.querySelector('error message');
        if (errorElement != null) {
            xhr.errorHandler(errorElement.textContent);
        } else {
            xhr.successHandler(parsedResponse);
        }
    } catch (e) {
        xhr.errorHandler(e.message);
    }
};

Watchis.loginSuccess = function(response)
{
    try {
        var rawItems = response.querySelectorAll('catalog item'),
            rawItem,
            fields = ['id', 'title', 'year', 'url', 'poster', 'rating', 'views', 'comments'],
            field,
            fieldValue,
            // TODO replace items with {} or even cache storage object so caching will be possible
            items = [],
            f;

        for (var i = 0; i < rawItems.length; i++) {
            var item = {};
            rawItem = rawItems[i];
            for (f = 0; f < fields.length; f++) {
                field = fields[f];
                fieldValue = rawItem.querySelector(field) ? rawItem.querySelector(field).textContent : null;
                item[field] = fieldValue;
            }
            items.push(item);
        }
    } catch (e) {
        Main.errorHandler(e.message);
    }

    Watchis.getGenresList();
    Watchis.itemsListSuccessHandler({items:items});
};

Watchis.itemInfoProcessor = function(response) {
    var rawItem = response.querySelector('item'),
        fields = [
            'id', 'title', 'year', 'genre', 'country',
            'director', 'cast', 'about', 'duration',
            'poster', 'video', 'hls', 'rtmp', 'lang'
        ],
        f,
        field,
        fieldValue,
        item = {};

    for (f = 0; f < fields.length; f++) {
        field = fields[f];
        fieldValue = rawItem.querySelector(field) ? rawItem.querySelector(field).textContent : null;
        if (field == 'video') {
            item['videos'] = [{streams: {http: {sd:fieldValue}}}];
        } else {
            item[field] = fieldValue;
        }
    }

    Watchis.infoSuccessHandler(item);
};

Watchis.generateMovieListUrl = function()
{
    // TODO make it correctly parse genres and years
    var url = 'movie/list';
    Docuim.filtersMap(function(f,filter){
        url += '/' + f + '/' + filter;
    });
    url = (url == '') ? '/' : url;

    return url;
};

Watchis.filtersMap = function(callback)
{
    var filter;
    for (var f in this.filters) {
        filter = this.filters[f];
        if (!this.filters.hasOwnProperty(f)) {
            continue;
        }

        if (filter == null) {
            continue;
        }
        callback(f, filter);
    }
};