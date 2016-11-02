var app = angular.module('halleApp.tratarLoginController', []);

app.controller('tratarLoginController', function($scope, $rootScope, $state, AnalyticsService, ValidTokenResource) {

  // Registrar Analytics
  AnalyticsService.add('tratarLoginController');

  // Acessando o storage local
  var storage = new getLocalStorage();

  $scope.back = function() {

     // acessando o recurso de API
     // INICIO
     ValidTokenResource.get({ token: storage.get() })
      .$promise
      .then(function(data) {
        if (data.code === "200") {
          $state.go("home.friendslist");
        }

      }, function(error) {
     });
     // final
  }

});
