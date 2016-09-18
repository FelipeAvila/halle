var app = angular.module('halleApp.welcomeController', []);

// Controller da pagina de criar usuario
app.controller('welcomeController', function($scope, $rootScope, $state, CreateUserResource, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('welcomeController');

  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();

  // Ação next
  $scope.next = function() {
    $state.go("home.friendslist");
  };

});
