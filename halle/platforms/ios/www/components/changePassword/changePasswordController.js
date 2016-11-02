var app = angular.module('halleApp.changePasswordController', []);

// Controller da pagina de criar usuario
app.controller('changePasswordController', function($scope, $rootScope, $state, $http, ChangePasswordResource, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('changePasswordController');

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
    var password1 = $scope.data.password1;
    var password2 = $scope.data.password2;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.changePwdRequired;
    }

    // senha 2
    if (password2 == null) {
      $scope.msgError = $rootScope.message.changePwdRequired2;
    }
    else {
      if (password2.length < 5 ) {
        $scope.msgError = $rootScope.message.changePwdMinlength2;
      }
      else if (password2.length > 8) {
        $scope.msgError = $rootScope.message.changePwdMaxlength2;
      }
    }

    // senha
    if (password1 == null) {
      $scope.msgError = $rootScope.message.changePwdRequired;
    }
    else {
      if (password1.length < 5 ) {
        $scope.msgError = $rootScope.message.changePwdMinlength;
      }
      else if (password1.length > 8) {
        $scope.msgError = $rootScope.message.changePwdMaxlength;
      }
    }

    if ($scope.msgError == "" && password1 != password2) {
      $scope.msgError = $rootScope.message.changePwdDif;
    }

    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
      // Tudo ok vamos iniciar a troca da senha
      // acessando o recurso de API
     ChangePasswordResource.update({ token: token, password: password1 })
      .$promise
        .then(function(data) {
          $scope.Success = true;
          $scope.msgSuccess =  data.message;
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
  };
});
