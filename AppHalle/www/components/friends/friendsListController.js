var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource, FindUserResource) {
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();

  // Lista de amigos
  $scope.friendslist = {};
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
    }, 30000);

    $scope.init();
  }

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend) {
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
            }

        },
        function(error) {
        });
  }
  // END SEND message

  $scope.send = function(token, phoneFriend, messageTypeId) {
    // acessando o recurso de API
    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    MessageSendResource.save({}, info)
     .$promise
       .then(function(data) {
         $scope.Success = true;
         $scope.msgSuccess =  data.message;

         $scope.share();

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

  $scope.share = function() {
    var token = storage.get();
    $cordovaSocialSharing.share($scope.data.name + $rootScope.message.messagePaz, $rootScope.message.messageSend, null, 'http://www.halleapp.net');
  }

});
