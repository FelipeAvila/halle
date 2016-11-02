var app = angular.module('halleApp.errorMessageController', []);

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
    $state.go("home.friendslist");
  }

});
