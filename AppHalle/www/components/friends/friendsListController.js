var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, FriendsListResource) {
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // acessando o recurso de API
 FriendsListResource.get({ token: token })
  .$promise
  .then(function(data) {
    $scope.friendslist = data;
  }, function(error) {
  });
});
