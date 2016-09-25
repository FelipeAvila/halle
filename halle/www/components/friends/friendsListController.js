var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $ionicTabsDelegate, $timeout, $interval, $ionicPopup, $cordovaSocialSharing, $ionicLoading, FriendsContactsListResource, FriendsFriendsListResource, MessageSendResource, MessageReceiveAmountResource, FindUserResource, EditUserResource, PushNotificationService, BadgeService, AnalyticsService, GetAllContactsService, LoadFriendsService) {

  // Registrar Analytics
  AnalyticsService.add('friendsListController');

  $timeout(function(){
    $ionicTabsDelegate.select(1);
  },0);

  var storage = new getLocalStorage();
  var token = storage.get();

  $rootScope.friendslist =
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

  $rootScope.contactslist = $rootScope.friendslist;

  // iniciando valores
  $rootScope.phone = null;
  $scope.dataFindUser = {};

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

  // INVITE
  $scope.invite = function() {
    $ionicPopup.alert({
      title: $rootScope.message.title,
      content: $rootScope.message.friendInviteZap
    }).then(function(res) {
      $cordovaSocialSharing.shareViaWhatsApp($rootScope.message.inviteFriendMessage, null, 'http://www.halleapp.net')
    });
  }

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend, tokenpush) {
     var messageTypeId = 0;
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
  }

  // Inicio INIT
  $scope.init = function() {
    //console.log('init - ' + $rootScope.phone + new Date() );

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
    // Se as informações do telefone não fora carregadas
    if ($rootScope.phone == null) {
      $scope.init();
    }

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
    }, function(error) {});

  }
  /// FINAL  messageReceive

  // INICIO Load friendslist
  $rootScope.initFriendList = function() {
    // acessando o recurso de API
   FriendsContactsListResource.get({ token: storage.get() })
    .$promise
    .then(function(data) {
      if (data.length == 0 && initVal == 0) {
        initVal = 1;
        $ionicPopup.alert({
          title: $rootScope.message.title,
          content: $rootScope.message.welcome
        }).then(function(res) {});
        $scope.getAllContacts();
      }
      else {
        LoadFriendsService.run();
      }
    },
    function(error) { });
  }
  // FINAL load  friendslist

  // onLoad
  $scope.onLoad = function() {
    $interval(function(){
      $scope.initMessageReceive();
    }, 15000);
    $scope.initMessageReceive();

    $rootScope.contactslist = storage.getContactList();
    $rootScope.friendslist = storage.getFriendList();

    if ($rootScope.contactslist == null || $rootScope.contactslist.length == 0) {
      $rootScope.initFriendList();
    }
  }

  $scope.onLoad();

});
