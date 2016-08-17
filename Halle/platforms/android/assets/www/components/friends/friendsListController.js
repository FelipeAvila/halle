var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $http, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource, FindUserResource, EditUserResource) {
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
  $scope.amountMessage = 0;

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
            if ($scope.data.tokenpush == null && $rootScope.tokenpush != null) {
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

            if ($scope.data.nickname == null) {
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
                  $scope.push(tokenpush);
              }

            }

        },
        function(error) {
        });
  }
  // END SEND message

  $scope.push = function(tokenpush) {
    var req = {
      method: 'POST',
      url: 'https://api.ionic.io/push/notifications',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MjNmOWQwNi1lMzYyLTRiNDQtOTgxNS1kZTdiNzJlMGNlMGYifQ.m8V5tWwKblAi2EJwRgCmJoWD1i4Jmd8uCo8Vi1Az2k8'
      },
      data: {
        "tokens": tokenpush,
        "profile": 'halle',
        "notification": {
          "message": $rootScope.message.messagePush,
          "android": {
            "message": $rootScope.message.messagePush
          },
          "ios": {
            "message": $rootScope.message.messagePush
          }
        }
      }
    };

    // Make the API call
    $http(req).success(function(resp){
      // Handle success
      console.log("Ionic Push: Push success", resp);
    }).error(function(error){
      // Handle error
      console.log("Ionic Push: Push error", error);
    });

    /*
    var info =
    {
        'tokens': '['+ tokenpush +']',
        'profile': 'halle',
        'notification': {
            'message': 'Você recebeu a Paz do Senhor.'
        }
    };

    console.log(info);
     // acessando o recurso de API
    PushNotificationResource.save({}, info)
     .$promise
       .then(function(data) {
       },
       function(error) {
       });
       */
  }

  $scope.send = function(token, phoneFriend, messageTypeId) {
    // acessando o recurso de API
    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    MessageSendResource.save({}, info)
     .$promise
       .then(function(data) {
         $scope.Success = true;
         $scope.msgSuccess =  data.message;

         //$scope.share();

         $ionicPopup.alert({
           title: $rootScope.message.title,
           content: $rootScope.message.messageSendSuccess
         }).then(function(res) {
         });
       },
       function(error) {
         $scope.error = true;
         $scope.msgError =  error.data.message;
       });

       $state.go("home.friendslist");
  }

  $scope.invite = function() {
    var token = storage.get();
    $cordovaSocialSharing.share($rootScope.message.inviteFriendMessage, $rootScope.message.messageSend, null, 'http://www.halleapp.net');
    //$cordovaSocialSharing.share($scope.data.name + $rootScope.message.messagePaz, $rootScope.message.messageSend, null, 'http://www.halleapp.net');
  }

});
