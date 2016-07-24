var app = angular.module('halleApp.forgotController', []);

// Controller da pagina de criar usuario
app.controller('forgotController', function($scope, $rootScope, $state, $ionicPopup, ForgotResource) {

  // Ação voltar
  $scope.voltar = function() {
      $state.go("login");
  };

  // Ação submit
  $scope.submit = function(login, phone) {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";

    // Validação
    // telefone
    if (phone == null) {
      $scope.msgError = $rootScope.message.forgotRequired;
    }

    // Login
    if (login == null) {
      $scope.msgError = $rootScope.message.forgotRequired;
    }
    else {
      if (login.length < 5 ) {
        $scope.msgError = $rootScope.message.forgotMinlength;
      }
      else if (login.length > 49) {
        $scope.msgError = $rootScope.message.forgotMaxlength;
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
      ForgotResource.get({ login: login, phone: phone })
       .$promise
       .then(function(data) {

         var alertPopup = $ionicPopup.alert({
           title: $rootScope.message.forgotCopyPass,
           template: data.newPassword
         });

       }, function(error) {
         $scope.error = true;

         console.log('forgot - ' + error.data.message);

         if (error.data === null) {
           $scope.msgError = $rootScope.message.forgotError;
         }
         else {
           $scope.msgError =  error.data.message;
         }
      });

    }
     //final do if testa erro

   }
});
