var app = angular.module('halleApp.messageController', []);

// Controller da pagina de criar usuario
app.controller('messageController', function($scope, $rootScope, $state, $http, $interval, $ionicSlideBoxDelegate, MessageReceiveResource) {

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
        console.log('leonaro - ' +$scope.messagelist);
        $ionicSlideBoxDelegate.update();
      }, function(error) {
      });
  };
  //FINAL LOAD

    $scope.data.slides = [
        {
            title : "Slide 1",
            data  : "Slide 1 Content"
        },
        {
            title : "Slide 2",
            data  : "Slide 2 Content"
        }
    ];



});
