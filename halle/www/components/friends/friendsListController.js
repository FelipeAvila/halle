var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $ionicTabsDelegate, $timeout, $state, $http, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveAmountResource, FindUserResource, EditUserResource, PushNotificationService, BadgeService, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('friendsListController');

  $timeout(function(){
    $ionicTabsDelegate.select(1);
  },0);

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

               var info = {'token': token, 'tokenpush': $rootScope.tokenpush};
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
   MessageReceiveAmountResource.get({ token: token })
    .$promise
    .then(function(data) {
      $scope.messagelist = data;
      if (data != null) {
        $scope.Success = true;
        $rootScope.amountMessage = data.sum;
        BadgeService.set($rootScope.amountMessage);
      }
    }, function(error) {
      console.log('friendsListController - MessageReceiveAmountResource - ERROR: ' + error);
    });

  }
  /// FINAL  messageReceive

  // INICIO Load friendslist
  $rootScope.initFriendList = function() {
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
     $scope.send(token, phoneFriend, messageTypeId);
     if (tokenpush != null) {
         PushNotificationService.push(tokenpush);
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
         console.log('mensagem enviada com sucesso!');
       },
       function(error) {
         console.log('mensagem enviada com erro - ' + error.data.message);
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
    console.log('onLoad');

    $interval(function(){
      $scope.initMessageReceive();
    }, 15000);

    try {
      $rootScope.initFriendList();
      $scope.initMessageReceive();
    } finally {
      //$scope.$broadcast('scroll.refreshComplete');
    }
  }

  $scope.onLoad();

});
