var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $ionicTabsDelegate, $timeout, $state, $http, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource, FindUserResource, EditUserResource, PushNotificationService, BadgeService, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('friendsListController');

  $timeout(function(){
    $ionicTabsDelegate.select(1);
  },0);

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

  // controlando o primeiro acesso
  var initVal = 0;

  // controlando a busca de amigos
  $scope.input = {
     searchAll : ''
   };

  $scope.clearSearch = function() {
    //console.log('search - ' + $scope.input.searchAll);
    $scope.input.searchAll='';
  };

  // Inicio INIT
  $scope.init = function() {
    //console.log('init - ' + $rootScope.phone + new Date() );
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
               var name = $scope.dataFindUser.name == null ? $scope.dataFindUser.login : $scope.dataFindUser.name;
               var nickname = $scope.dataFindUser.nickname == null ? $scope.dataFindUser.login : $scope.dataFindUser.nickname;

               var info = {'token': token, 'name': name, 'nickname': nickname, 'birthday': $scope.dataFindUser.birthday, 'email': $scope.dataFindUser.email, 'photo': $scope.dataFindUser.photo, 'tokenpush': $rootScope.tokenpush };
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
    return true;
  }
  //FINAL INIT

  //INICIO messageReceive
  $scope.initMessageReceive = function() {
    //console.log('initMessageReceive - ' + new Date() + ' - ' + $scope.initLoad);

    // Se as informações do telefone não fora carregadas
    if ($rootScope.phone == null) {
      $scope.init();
    }

    // get Token
    var token = storage.get();
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
      console.log('friendsListController - MessageReceiveResource - ERROR: ' + error);
    });

  }
  /// FINAL  messageReceive

  // INICIO Load friendslist
  $scope.initFriendList = function() {
    //console.log('initFriendList - ' + new Date() );
    // get Token
    var token = storage.get();

    // acessando o recurso de API
   FriendsListResource.get({ token: token })
    .$promise
    .then(function(data) {
      $scope.friendslist = data;

      if ($scope.friendslist.length == 0 && initVal == 0) {
        initVal = 1;

        $scope.getAllContacts();

        $ionicPopup.alert({
          title: $rootScope.message.title,
          content: $rootScope.message.welcome
        }).then(function(res) {

          FriendsListResource.get({ token: token })
           .$promise
           .then(function(data) {
             $scope.friendslist = data;
           },
           function(error) {
           });

        });
      }
    },
    function(error) {
    });
  }
  // FINAL load  friendslist


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

  // SEND
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

  // INVITE
  $scope.invite = function() {
    var token = storage.get();

    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.friendInviteZap
    }).then(function(res) {
      $cordovaSocialSharing.shareViaWhatsApp($rootScope.message.inviteFriendMessage, null, 'http://www.halleapp.net')
    });
  }

  // onLoad
  $scope.onLoad = function() {
    //console.log('onLoad');

    $interval(function(){
      $scope.initMessageReceive();
    }, 20000);

    $interval(function(){
      $scope.initFriendList();
    }, 300000); // 5 minutos
  }

  $scope.doRefresh = function() {
    try {
      $scope.initFriendList();
      $scope.initMessageReceive();
    } finally {
      $scope.$broadcast('scroll.refreshComplete');
    }
  };

  // chamando o onload para iniciar o carregamento da interface
  $scope.doRefresh();
  $scope.onLoad();

  //$scope.welcomeActive1 = true;
  //console.log('welcomeActive - ' + $scope.welcomeActive1);

});
