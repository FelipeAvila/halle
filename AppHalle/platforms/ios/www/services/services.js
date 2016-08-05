var app = angular.module('halleApp.services', ['ngResource']);

/*****************Serviços *********************************/
app.service('AuthService', function($q, AuthResource) {
  var item = "";

  this.send = function(login, password) {
     AuthResource.save({ login: login, password: password })
        .$promise
          .then(function(data) {
            item = data.toJSON();
          });
     return item;
  };
});
