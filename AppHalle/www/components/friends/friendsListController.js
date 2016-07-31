var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $ionicPopup, FriendsListResource, MessageSendResource, MessageReceiveResource) {
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();
  // Lista de amigos
  $scope.friendslist = {};
  // Total de mensagens recebidas
  $scope.amountMessage = 0;

  $scope.onLoad = function() {

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

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend) {
    var messageTypeId = 0;

    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    // acessando o recurso de API
   MessageSendResource.save({}, info)
    .$promise
      .then(function(data) {
        $scope.Success = true;
        $scope.msgSuccess =  data.message;

        $ionicPopup.alert({
          title: $rootScope.message.title,
          content: $rootScope.message.messageSendSuccess
        }).then(function(res) {
          console.log('Test Alert Box');
        });
      },
      function(error) {
        $scope.error = true;
        $scope.msgError =  error.data.message;
      });
      $state.go("home.friendslist");
  }
  // END SEND message

});
