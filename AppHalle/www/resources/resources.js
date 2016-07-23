var app = angular.module('halleApp.resources', ['ngResource']);

/****************Constantes ***********************/
app.constant('ApiEndpoint', {
  url: 'http://192.241.158.95/HalleWEB/service'
});

/*****************Recursos*****************************/
app.factory('AuthResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/auth/:login/:password',
                                      {login: '@login', password: '@password' },
                                      {save:   {method:'POST'}}
                         );
    return data;
});


app.factory('CreateUserResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/:login/:phone/:password',
                                      {login: '@login', phone: '@phone', password: '@password' },
                                      {save:   {method:'POST'}}
                         );
    return data;
});

app.factory('FriendsListResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/friend/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', isArray: true}}
                         );
    return data;
});
