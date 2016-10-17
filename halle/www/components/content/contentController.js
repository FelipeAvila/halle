var app = angular.module('halleApp.contentController', []);

app.controller('contentController', function($ionicHistory, $scope, $rootScope, $stateParams, $state, $ionicPopup, PushNotificationService, MessageTypeResource, MessageSendResource, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('contentController');

  $scope.images = [];
  var storage = new getLocalStorage();
  var token = storage.get();

  $scope.init = function() {

    MessageTypeResource.get({})
     .$promise
     .then(function(data) {

       $scope.images = data;

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
    AnalyticsService.trackEvent('sendMessage', messageTypeId);

    // Send message
    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.messageSendSuccess
    }).then(function(res) {
      console.log('page - ' + $rootScope.pageOrigem);

      if ($rootScope.pageOrigem == "message") {

        if ($rootScope.amountMessage > 0) {
          $state.go("home.message");
        }
        else {
          $state.go("home.friendslist");
        }
      }
      else {
          $state.go("home.friendslist");
      }

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
