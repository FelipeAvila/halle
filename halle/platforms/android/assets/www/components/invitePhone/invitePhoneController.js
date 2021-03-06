var app = angular.module('halleApp.invitePhoneController', []);

// Controller da pagina de criar usuario
app.controller('invitePhoneController', function($scope, $rootScope, $state, $http, InvitePhoneNumberResource, AnalyticsService, LoadFriendsService) {

  // Registrar Analytics
  AnalyticsService.add('invitePhoneController');

  // Form data
  $scope.data = {};
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // Perform the submit
  $scope.onSubmit = function() {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de OK
    $scope.Success = false;
    $scope.msgSuccess = "";

    // atributos
    var name = $scope.data.name;
    var phone = $scope.data.phone;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.inviteContactsInvalid;
    }

    // telefone
    if (phone == null) {
      $scope.msgError = $rootScope.message.inviteContactsInvalid;
    }

    if (name == null) {
      $scope.msgError = $rootScope.message.inviteContactsName;
    }

    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {

      // acessando o recurso de API
     InvitePhoneNumberResource.save({ token: token, name: name, phone: phone })
      .$promise
        .then(function(data) {
          $scope.Success = true;
          $scope.msgSuccess =  data.message;
          LoadFriendsService.runFriends();
          LoadFriendsService.runContacts();
        },
        function(error) {
          $scope.error = true;
          if (error.status == '404') {
            $scope.msgError = $rootScope.message.error404;
          }
          else {
            $scope.msgError =  error.data.message;
          }
        });
    }
  }
});
