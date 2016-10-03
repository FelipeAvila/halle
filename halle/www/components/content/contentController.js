var app = angular.module('halleApp.contentController', []);

app.controller('contentController', function($scope, $rootScope, $stateParams, $state, $ionicPopup, PushNotificationService, MessageTypeResource, MessageSendResource) {

  $scope.images = [];
  var storage = new getLocalStorage();
  var token = storage.get();



  $scope.init = function() {

    MessageTypeResource.get({})
     .$promise
     .then(function(data) {

       $scope.images = data;
       console.log($scope.images.length);

     }, function(error) {
       console.log('Não foi possivel carregar as mensagens.');
     });

  }

  $scope.input = {
     searchAll : ''
   };

  $scope.clearSearch = function() {
    $scope.input.searchAll='';
  };

  // INIT SEND message
  $scope.sendMessage = function(messageTypeId) {
     $scope.send(token, $stateParams.phoneFriend, messageTypeId);
     if ($stateParams.tokenpush != null) {
         PushNotificationService.push($stateParams.tokenpush);
     }
  }
  // END SEND message

  // SEND
  $scope.send = function(token, phoneFriend, messageTypeId) {
    // Send message
    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.messageSendSuccess
    }).then(function(res) {
      $state.go("home.friendslist");
    });

    // acessando o recurso de API
    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    MessageSendResource.save({}, info)
     .$promise
       .then(function(data) {
         console.log('mensagem enviada com sucesso!');
       },
       function(error) {
         console.log('mensagem enviada com erro - ' + error.data.message);
       });
  }

});
