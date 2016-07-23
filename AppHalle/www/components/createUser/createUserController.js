var app = angular.module('halleApp.createUserController', []);

// Controller da pagina de criar usuario
app.controller('createUserController', function($scope, $state, CreateUserResource) {
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";

  // Ação voltar\ G2  SVJ A
  $scope.voltar = function() {
      $state.go("login");
  };

  // Ação submit
  $scope.submit = function(login, phone, password) {
    // Acessando o storage local
    var storage = new getLocalStorage();

     // acessando o recurso de API
    CreateUserResource.save({ login: login, phone: phone, password: password })
     .$promise
     .then(function(data) {
       console.log('ok - ' + data);
       $scope.error = true;
       storage.save(data.token);
       $state.go("home.friendslist");
     }, function(error) {
       console.log('error - ' + error);
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
