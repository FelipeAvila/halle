var app = angular.module('halleApp.createUserController', []);

// Controller da pagina de criar usuario
app.controller('createUserController', function($scope, $rootScope, $state, CreateUserResource) {

  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();

  // Ação voltar
  $scope.voltar = function() {
      $state.go("login");
  };

  // Ação submit
  $scope.submit = function(login, phone, password) {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de OK
    $scope.Success = false;
    $scope.msgSuccess = "";

    // Validação
    // senha
    if (password == null) {
      $scope.msgError = $rootScope.message.createPwdRequired;
    }
    else {
      if (password.length < 5 ) {
        $scope.msgError = $rootScope.message.createPwdMinlength;
      }
      else if (password.length > 8) {
        $scope.msgError = $rootScope.message.createPwdMaxlength;
      }
    }

    // telefone
    if (phone == null) {
      $scope.msgError = $rootScope.message.createPhoneRequired;
    }

    // Login
    if (login == null) {
      $scope.msgError = $rootScope.message.createLoginRequired;
    }
    else {
      if (login.length < 5 ) {
        $scope.msgError = $rootScope.message.createLoginMinlength;
      }
      else if (login.length > 49) {
        $scope.msgError = $rootScope.message.createLoginMaxlength;
      }
    }

    // inicio if testa erro
    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
       // acessando o recurso de API
      CreateUserResource.save({ login: login, phone: phone, password: password, tokenpush: $rootScope.tokenpush })
       .$promise
       .then(function(data) {
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

    }
     //final do if testa erro
  };
});
