var app = angular.module('halleApp.loginController', []);

// Controller da pagina de login
app.controller('loginController', function($ionicSideMenuDelegate, $scope, $state, $rootScope, AuthResource) {
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // Ação criar
  $scope.create = function() {
      $state.go("createUser");
  };

  // Ação submit
  $scope.submit = function(login, password) {
    // Acessando o storage local
    var storage = new getLocalStorage();

     // acessando o recurso de API
    AuthResource.save({ login: login, password: password })
     .$promise
       .then(function(data) {
         $scope.error = true;
         storage.save(data.token);
         $state.go("home.friendslist");
       }, function(error) {
         $scope.error = true;
         if (error.data === null) {
           $scope.msgError = $rootScope.message.loginError;
         }
         else {
           $scope.msgError =  error.data.message;
         }
    });
  };
});
