var app = angular.module('halleApp.createUserController', []);

// Controller da pagina de criar usuario
app.controller('createUserController', function($scope, $rootScope, $state, CreateUserResource) {

  // Ação voltar
  $scope.voltar = function() {
      $state.go("login");
  };

  // Ação submit
  $scope.submit = function(login, phone, password) {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";

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

      // Acessando o storage local
      var storage = new getLocalStorage();

       // acessando o recurso de API
      CreateUserResource.save({ login: login, phone: phone, password: password })
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
