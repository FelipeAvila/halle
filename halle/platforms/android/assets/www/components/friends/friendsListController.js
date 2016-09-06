var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $http, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource, FindUserResource, EditUserResource, PushNotificationService, BadgeService, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('friendsListController');

  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  // iniciando valores
  $rootScope.phone = null;
  $scope.friendslist = 0;
  $scope.dataFindUser = {};
  var interval = 1500;

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

  var initVal = 0;

  $scope.input = {
     searchAll : ''
   };

  $scope.clearSearch = function() {
    console.log('search - ' + $scope.input.searchAll);
    $scope.input.searchAll='';
  };

  // Inicio INIT
  $scope.init = function() {
    console.log('init');
    // get Token
    var token = storage.get();

    if ($rootScope.phone == null) {
     FindUserResource.get({ token: token })
      .$promise
        .then(function(data) {
            $scope.dataFindUser = data;
            $rootScope.phone = $scope.dataFindUser.phone;

            // Atualiza o tokenpush
            if (($scope.dataFindUser.tokenpush == null && $rootScope.tokenpush != null) || ($scope.dataFindUser.tokenpush != $rootScope.tokenpush && $rootScope.tokenpush != null)) {
               var info = {'token': token, 'name': $scope.dataFindUser.name, 'nickname': $scope.dataFindUser.nickname, 'birthday': $scope.dataFindUser.birthday, 'email': $scope.dataFindUser.email, 'photo': $scope.dataFindUser.photo, 'tokenpush': $rootScope.tokenpush };

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
  }
  //FINAL INIT

  //INICIO messageReceive
  $scope.initMessageReceive = function() {
    //console.log('interval - ' + interval);
    // Se as informações do telefone não fora carregadas
    if ($rootScope.phone == null) {
      $scope.init();
    }

    // Se os contatos não foram carregados, carregar a cada atualização.
    if ($scope.friendslist == null || $scope.friendslist.length == 0){
      $scope.initFriendList();
    }

    // get Token
    var token = storage.get();
    // acessando o recurso de API
   MessageReceiveResource.get({ token: token })
    .$promise
    .then(function(data) {
      $scope.messagelist = data;
      if (data != null) {
        interval = 15000;
        $scope.Success = true;
        $rootScope.amountMessage = data.length;
        BadgeService.set($rootScope.amountMessage);
      }
    }, function(error) {
      interval = interval * 2;
      console.log('friendsListController - MessageReceiveResource - ERROR: ' + error);
    });

  }
  /// FINAL  messageReceive

  // INICIO Load friendslist
  $scope.initFriendList = function() {
    console.log('initFriendList');

    // get Token
    var token = storage.get();

    // acessando o recurso de API
   FriendsListResource.get({ token: token })
    .$promise
    .then(function(data) {
      $scope.friendslist = data;

      if ($scope.friendslist.length == 0 && initVal == 0) {
        initVal = 1;
        $ionicPopup.alert({
          title: $rootScope.message.title,
          content: $rootScope.message.welcome
        }).then(function(res) {
        });

        $scope.getAllContacts();
      }
    }, function(error) {
    });
    $scope.$broadcast('scroll.refreshComplete');

  }
  // FINAL load  friendslist

  // onLoad
  $scope.onLoad = function() {

    $interval(function(){
      $scope.initMessageReceive();
    }, interval);

    $interval(function(){
      $scope.initFriendList();
    }, 300000); // 5 minutos

    $scope.init();
    $scope.initFriendList();
    $scope.initMessageReceive();
  }

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend, tokenpush) {
     var messageTypeId = 0;
     var token = storage.get();

     if ( $scope.dataFindUser.nickname == null && $scope.dataFindUser.name == null ) {
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

    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.friendInviteZap
    }).then(function(res) {
      $cordovaSocialSharing.shareViaWhatsApp($rootScope.message.inviteFriendMessage, null, 'http://www.halleapp.net')
    });
  }

});
