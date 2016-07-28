var app = angular.module('halleApp.messageController', []);

// Controller da pagina de criar usuario
app.controller('messageController', function($scope, $rootScope, $state, $http, $ionicSlideBoxDelegate, MessageReceiveResource) {

  // Form data
  $scope.data = {};

  // INICIO LOAD
  $scope.onLoad = function() {

     // Acessando o storage local
     var storage = new getLocalStorage();
     var token = storage.get();

      // acessando o recurso de API
     MessageReceiveResource.get({ token: token })
      .$promise
      .then(function(data) {
        $scope.messagelist = data;

        if (data != null) {
          $scope.sucess = true;
          $scope.amountMessage = data.length;
          console.log('onLoad - ' + $scope.amountMessage);


        }
      }, function(error) {
      });
  };
  //FINAL LOAD

  $scope.navSlide = function(index) {
      $ionicSlideBoxDelegate.slide(index, 500);
  }

});
