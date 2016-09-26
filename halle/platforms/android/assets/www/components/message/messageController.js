var app = angular.module('halleApp.messageController', []);

// Controller da pagina de criar usuario
app.controller('messageController', function($scope, $rootScope, $state, $http, $ionicPopup, $interval, $ionicSlideBoxDelegate, $cordovaSocialSharing, MessageReceiveResource, InvitePhoneNumberResource, MessageSendResource, MessageUpdateResource, PushNotificationService, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('messageController');

  // Form data
  $scope.data = {};
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  $scope.Success = false;
  // mensagem de OK
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();
  // Lista de mensagens
  $scope.messagelist = {};

  $scope.slideHasChanged = function($index){
    console.log('slideHasChanged $index=' + $index);
    if ($scope.messagelist != null) {
        // acessando o recurso de API
       var info = {'token': token, 'messageid': $scope.messagelist[$index].messageId};
       MessageUpdateResource.save(info)
        .$promise
          .then(function(data) {
          },
          function(error) {
          });

       if ($rootScope.amountMessage > 0) {
         $rootScope.amountMessage = $rootScope.amountMessage -1;
       }

    }
  };

  // INICIO LOAD
  $scope.onLoad = function() {
     console.log('onLoad MessageController');
      // acessando o recurso de API
     MessageReceiveResource.get({ token: token })
      .$promise
      .then(function(data) {
        $scope.messagelist = data;
        $ionicSlideBoxDelegate.update();

        if ($scope.messagelist.length > 0) {
           $rootScope.amountMessage = $rootScope.amountMessage -1;

            // acessando o recurso de API
           var info = {'token': token, 'messageid': $scope.messagelist[0].messageId};
           MessageUpdateResource.save(info)
            .$promise
              .then(function(data) {
              },
              function(error) {
              });
        }

      }, function(error) {
        console.log('MessageController - MessageReceiveResource - ' + error);
        $state.go("home.errorMessage");
      });

  };
  //FINAL LOAD

  // INICIO REPLY
  $scope.reply = function(phone, messageTypeId, tokenPush) {
      var token = storage.get();

      var info = {'token': token, 'phoneFriend': phone, 'messageTypeId': messageTypeId};
      // acessando o recurso de API
     MessageSendResource.save({}, info)
      .$promise
        .then(function(data) {
          $scope.Success = true;
          $scope.msgSuccess =  data.message;

          if (tokenPush != null) {
              PushNotificationService.push(tokenPush);
          }

          $ionicPopup.alert({
            title: $rootScope.message.title,
            content: $rootScope.message.messageSendSuccess
          }).then(function(res) {
          });
        },
        function(error) {
          $ionicPopup.alert({
            title: $rootScope.message.title,
            content: error.data.message
          });
        });
  }
  // FINAL reply

  //INICIO INVITE
  $scope.invite = function(name, phone) {
    $scope.data.name = name;
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.name">',
      title: $rootScope.message.title,
      subTitle: $rootScope.message.messageFriendName,
      scope: $scope,
      buttons: [
        { text: $rootScope.message.cancel },
        {
          text: '<b>'+ $rootScope.message.ok +'</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.name) {
              e.preventDefault();
            } else {
                // acessando o recurso de API
               InvitePhoneNumberResource.save({ token: token, name: $scope.data.name, phone: phone })
                .$promise
                  .then(function(data) {
                    $ionicPopup.alert({
                      title: $rootScope.message.title,
                      content: $rootScope.message.messageInviteSuccess
                    });
                  },
                  function(error) {
                    $ionicPopup.alert({
                      title: $rootScope.message.title,
                      content: error.data.message
                    });
                  });
                  // Finalizando
            }
          }
        }
      ]
    });
    // FINAL INVITE
  }

  // Perform the shareWhatsApp
  $scope.shareWhatsApp = function(nickname, image, content) {
    var imageSrc = "";
    if (content == null) {
      imageSrc = "data:image/jpeg;base64," + image;
    }
    else {
        var imageSrc = content;
    }

    var message = $rootScope.message.messageFriendReturn + nickname + $rootScope.message.messageFriendReturn2;
    $cordovaSocialSharing
    .shareViaWhatsApp(message, imageSrc, 'http://www.halleapp.net')
    .then(function(result) {
    }, function(err) {
    });
  }

  // Perform the shareFacebook
  $scope.shareFacebook = function(nickname, image, content) {
console.log('shareFacebook - ' + content);

    var imageSrc = "";
    if (content == null) {
      imageSrc = "data:image/jpeg;base64," + image;
    }
    else {
        var imageSrc = content;
    }
    var message = $rootScope.message.messageFriendReturn + nickname + $rootScope.message.messageFriendReturn2;
    $cordovaSocialSharing
    .shareViaFacebookWithPasteMessageHint(message, imageSrc, 'http://www.halleapp.net', $rootScope.message.messageFriendPaste)
    .then(function(result) {
      console.log('shareFacebook - ' + result);
    }, function(err) {
      console.log('shareFacebook - ' + err);
    });
  }


});
