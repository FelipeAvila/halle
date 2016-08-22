var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $http, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource, FindUserResource, EditUserResource, PushNotificationService, BadgeService) {
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();

  // Lista de amigos
  $scope.friendslist =
    [{
        "message": [],
        "id": 0,
        "phone": null,
        "phoneFriend": null,
        "name": null,
        "photoFriend": null,
        "messageSent": 0,
        "messageReceive": 0,
        "hasHalle": 0,
        "status": 0,
        "register": null
    }];
  // Total de mensagens recebidas
  $rootScope.amountMessage = 0;

  // Inicio INIT
  $scope.init = function() {
    // get Token
    var token = storage.get();

    if ($rootScope.phone == null) {
     FindUserResource.get({ token: token })
      .$promise
        .then(function(data) {
            $scope.data = data;
            $rootScope.phone = $scope.data.phone;

            // Atualiza o tokenpush
            if (($scope.data.tokenpush == null && $rootScope.tokenpush != null) || ($scope.data.tokenpush != $rootScope.tokenpush && $rootScope.tokenpush != null)) {
               var info = {'token': token, 'name': $scope.data.name, 'nickname': $scope.data.nickname, 'birthday': $scope.data.birthday, 'email': $scope.data.email, 'photo': $scope.data.photo, 'tokenpush': $rootScope.tokenpush };

                // acessando o recurso de API
               EditUserResource.save({}, info)
                .$promise
                  .then(function(data) {
                  },
                  function(error) {
                  });
            }
        },
        function(error) {
          $scope.error = true;
          $scope.msgError =  error.data.message;
        });
    }

     // acessando o recurso de API
    MessageReceiveResource.get({ token: token })
     .$promise
     .then(function(data) {
       $scope.messagelist = data;
       if (data != null) {
         $scope.Success = true;
         $rootScope.amountMessage = data.length;
         BadgeService.set($rootScope.amountMessage);
       }
     }, function(error) {
     });

     // acessando o recurso de API
    FriendsListResource.get({ token: token })
     .$promise
     .then(function(data) {
       $scope.friendslist = data;

       if ($scope.friendslist.length == 0) {
         $scope.getAllContacts();
       }
     }, function(error) {
     });
     $scope.$broadcast('scroll.refreshComplete');

  }
  //FINAL INIT

  // onLoad
  $scope.onLoad = function() {

    $interval(function(){
      $scope.init();
    }, 15000);

    $scope.init();
  }

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend, tokenpush) {
     var messageTypeId = 0;
     var token = storage.get();
      // acessando o recurso de API
     FindUserResource.get({ token: token })
      .$promise
        .then(function(data) {

            $scope.data = data;

            if ( $scope.data.nickname == null && $scope.data.name == null ) {
              $ionicPopup.alert({
                title: $rootScope.message.title,
                content: $rootScope.message.messageSendError
              }).then(function(res) {
                return;
              });
            }
            else {
              $scope.send(token, phoneFriend, messageTypeId);
              if (tokenpush != null) {
                  PushNotificationService.push(tokenpush);
              }
            }

        },
        function(error) {
        });
  }
  // END SEND message

  $scope.send = function(token, phoneFriend, messageTypeId) {
    // Send message
    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.messageSendSuccess
    }).then(function(res) {
    });

    // acessando o recurso de API
    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    MessageSendResource.save({}, info)
     .$promise
       .then(function(data) {
         $scope.Success = true;
         $scope.msgSuccess =  data.message;
         console.log('mensagem enviada com sucesso!');
       },
       function(error) {
         $scope.error = true;
         $scope.msgError =  error.data.message;
         console.log('mensagem enviada com erro - ' + error);
       });

       //$state.go("home.friendslist");
  }

  $scope.invite = function() {
    var token = storage.get();
    $cordovaSocialSharing.share($rootScope.message.inviteFriendMessage, $rootScope.message.messageSend, null, 'http://www.halleapp.net');
    //$cordovaSocialSharing.share($scope.data.name + $rootScope.message.messagePaz, $rootScope.message.messageSend, null, 'http://www.halleapp.net');
  }

});
