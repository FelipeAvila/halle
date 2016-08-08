var app = angular.module('halleApp.messageController', []);

// Controller da pagina de criar usuario
app.controller('messageController', function($scope, $rootScope, $state, $http, $ionicPopup, $interval, $ionicSlideBoxDelegate, MessageReceiveResource, InvitePhoneNumberResource, MessageSendResource, MessageUpdateResource) {

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
    }
  };

  // INICIO LOAD
  $scope.onLoad = function() {
      // acessando o recurso de API
     MessageReceiveResource.get({ token: token })
      .$promise
      .then(function(data) {
        $scope.messagelist = data;
        $ionicSlideBoxDelegate.update();

        if ($scope.messagelist.length > 0) {
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
      });


  };
  //FINAL LOAD

  // INICIO REPLY
  $scope.reply = function(phone, messageTypeId) {
      var token = storage.get();

      var info = {'token': token, 'phoneFriend': phone, 'messageTypeId': messageTypeId};
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
});
