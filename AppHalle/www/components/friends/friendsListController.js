var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, FriendsListResource, MessageReceiveResource) {
  $scope.Success = false;

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
        $scope.Success = true;
        $scope.amountMessage = data.length;
      }
    }, function(error) {
    });

    // acessando o recurso de API
   FriendsListResource.get({ token: token })
    .$promise
    .then(function(data) {
      $scope.friendslist = data;
    }, function(error) {
    });
     $scope.$broadcast('scroll.refreshComplete');
  }


});
