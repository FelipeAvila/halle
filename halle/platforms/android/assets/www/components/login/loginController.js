var app = angular.module('halleApp.loginController', []);

// Controller da pagina de login
app.controller('loginController', function($ionicSideMenuDelegate, $scope, $state, $rootScope, AuthResource, AnalyticsService) {

  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";

  // Registrar Analytics
  AnalyticsService.add('loginController');

  // Acessando o storage local
  var storage = new getLocalStorage();

  // Ação criar
  $scope.create = function() {
      $state.go("createUser");
  };

  // Ação submit
  $scope.submit = function(login, password) {

    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de OK
    $scope.Success = false;
    $scope.msgSuccess = "";

    // Validação
    // senha
    if (password == null) {
      $scope.msgError = $rootScope.message.loginPwdRequired;
    }
    else {
      if (password.length < 5 ) {
        $scope.msgError = $rootScope.message.loginPwdMinlength;
      }
      else if (password.length > 8) {
        $scope.msgError = $rootScope.message.loginPwdMaxlength;
      }
    }

    // Login
    if (login == null) {
      $scope.msgError = $rootScope.message.loginRequired;
    }
    else {
      if (login.length < 5 ) {
        $scope.msgError = $rootScope.message.loginMinlength;
      }
      else if (login.length > 49) {
        $scope.msgError = $rootScope.message.loginMaxlength;
      }
    }

    // inicio if testa erro
    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {

       // acessando o recurso de API
      AuthResource.save({ login: login, password: password })
       .$promise
         .then(function(data) {
           $scope.error = true;
           storage.save(data.token);
           $state.go("home.friendslist");
         }, function(error) {
           $scope.error = true;
           if (error.status == '404') {
             $scope.msgError = $rootScope.message.error404;
           }
           else if (error.data === null) {
             $scope.msgError = $rootScope.message.loginError;
           }
           else {
             $scope.msgError =  error.data.message;
           }
      });
    }
    // fim if testa erro

  };
});
