var app = angular.module('halleApp.invitePhoneController', []);

// Controller da pagina de criar usuario
app.controller('invitePhoneController', function($scope, $rootScope, $state, $http, InvitePhoneNumberResource) {

  // Form data
  $scope.data = {};

  // Perform the login action when the user submits the login form
  $scope.onSubmit = function() {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de sucesso
    $scope.sucess = false;
    $scope.msgSucess = "";

    // atributos
    var phone = $scope.data.phone;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.inviteContactsInvalid;
    }

    // telefone
    if (phone == null) {
      $scope.msgError = $rootScope.message.inviteContactsInvalid;
    }

    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
      // Acessando o storage local
      var storage = new getLocalStorage();
      var token = storage.get();

      // acessando o recurso de API
     InvitePhoeNumberResource.save({ token: token, phone: phone })
      .$promise
        .then(function(data) {
          $scope.sucess = true;
          $scope.msgSucess =  data.message;
        },
        function(error) {
          $scope.error = true;
          $scope.msgError =  error.data.message;
        });
    }
  }
});
