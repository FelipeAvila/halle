var app = angular.module('halleApp.friendsListController', []);

app.controller('friendsListController', function($scope, $rootScope, $state, $interval, $ionicPopup, $cordovaSocialSharing, FriendsListResource, MessageSendResource, MessageReceiveResource) {
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
    }, 5000);

    $scope.init();
  }



  // INIT SEND message
  $scope.sendMessage = function(phoneFriend) {
      var messageTypeId = 0;
      var token = storage.get();

      var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
      // acessando o recurso de API
     MessageSendResource.save({}, info)
      .$promise
        .then(function(data) {
          $scope.Success = true;
          $scope.msgSuccess =  data.message;

          var message = 'teste';
          var image = null;
          var link = null;
          $cordovaSocialSharing
             .shareViaWhatsApp(message, image, link)
             .then(function(result) {
               // Success!
             }, function(err) {
               // An error occurred. Show a message to the user
             });


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
  // END SEND message


});
