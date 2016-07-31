var app = angular.module('halleApp.messageController', []);

// Controller da pagina de criar usuario
app.controller('messageController', function($scope, $rootScope, $state, $http, $interval, $ionicSlideBoxDelegate, MessageReceiveResource) {

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

  // INICIO LOAD
  $scope.onLoad = function() {
      // acessando o recurso de API
     MessageReceiveResource.get({ token: token })
      .$promise
      .then(function(data) {
        $scope.messagelist = data;
        $ionicSlideBoxDelegate.update();
      }, function(error) {
      });
  };
  //FINAL LOAD

});
