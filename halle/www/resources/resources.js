var app = angular.module('halleApp.resources', ['ngResource']);

/****************Constantes ***********************/
app.constant('ApiEndpoint', {
  //url: 'http://192.241.158.95/HalleWEB/service'
  //url: 'https://apidev.halleapp.net/HalleWEB/service'
  url: 'https://api.halleapp.net/HalleWEB/service'
});

/////
/*****************Recursos*****************************/
app.factory('AuthResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/auth/:login/:password',
                                      {login: '@login', password: '@password' },
                                      {save:   {method:'POST', timeout: 3000 }}
                         );
    return data;
});

app.factory('CreateUserResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/:login/:phone/:password/:tokenpush',
                                      {login: '@login', phone: '@phone', password: '@password', tokenpush: '@tokenpush' },
                                      {save:   {method:'POST', timeout: 3000}}
                         );
    return data;
});

app.factory('ForgotResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/forgot/:login/:phone',
                                      {login: '@login', phone: '@phone' },
                                      {save:   {method:'POST', timeout: 3000}}
                         );
    return data;
});


app.factory('FriendsListResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/friend/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', isArray: true, timeout: 3000}}
                         );
    return data;
});

app.factory('InvitePhoneNumberResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/invite/phone/:token/:name/:phone',
                                      {token: '@token', name : '@name', phone : '@phone' },
                                      {save:   {method:'POST', timeout: 3000}}
                         );
    return data;
});

app.factory('FindUserResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', timeout: 3000}}
                         );
    return data;
});

app.factory('EditUserResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/',
                                      {save:   {method:'POST',
                                                timeout: 3000,
                                                headers: [{'Content-Type': 'application/json'}]
                                      }}
                         );
    return data;
});

app.factory('ValidTokenResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/valid/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', timeout: 3000}}
                         );
    return data;
});

app.factory('ChangePasswordResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/changepassword/:token/:password',
                                      {token: '@token', password: '@password' },
                                      {update:   {method:'PUT', timeout: 3000}}
                         );
    return data;
});

app.factory('DeletePhoneResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/user/:token',
                                      {token: '@token' },
                                      {delete:   {method:'DELETE', timeout: 3000}}
                         );
    return data;
});

app.factory('FeedbackResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/feedback/',
                                      {save:   {method:'POST',
                                                timeout: 3000,
                                                headers: [{'Content-Type': 'application/json'}]
                                      }}
                         );
    return data;
});

app.factory('MessageReceiveResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/message/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', isArray: true, timeout: 3000}}
                         );
    return data;
});

app.factory('MessageReceiveAmountResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/message/amount/:token',
                                      {token: '@token' },
                                      {get:   {method:'GET', timeout: 3000}}
                         );
    return data;
});


app.factory('MessageSendResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/message/',
                                      {save:   {method:'POST',
                                                timeout: 3000,
                                                headers: [{'Content-Type': 'application/json'}]
                                      }}
                         );
    return data;
});

app.factory('MessageUpdateResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/message/update/:token/:messageid',
                                        {token: '@token', messageid : '@messageid' },
                                        {save:   {method:'POST', timeout: 3000}}
                                    );
    return data;
});

app.factory('MessageSendResource', function ($resource, ApiEndpoint) {
    var data =  $resource(ApiEndpoint.url +'/message/',
                                      {save:   {method:'POST',
                                                timeout: 3000,
                                                headers: [{'Content-Type': 'application/json'}]
                                      }}
                         );
    return data;
});
