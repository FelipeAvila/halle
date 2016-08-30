var app = angular.module('halleApp.errorMessageController', []);

// Controller da pagina de criar usuario
app.controller('errorMessageController', function($scope, $rootScope, $state, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('errorMessageController');

  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";

  $scope.goMessageAgain = function() {
    console.log('goMessageAgain');
    $state.go("home.friendslist");
  }

});
