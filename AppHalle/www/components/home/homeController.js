var app = angular.module('halleApp.homeController', []);

// Controler da pagina incial
app.controller('homeController', function($scope, $rootScope, $ionicPopup, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource, MessageSendResource, InvitePhoneNumberResource, MessageReceiveResource) {
  $scope.contacts = {};

  // INIT home
  $scope.goHome = function() {
    $state.go("home.friendslist");
  }
  // FINAL home

  // INIT getAllContacts
  $scope.getAllContacts = function() {

    // Acessando o storage local
    var storage = new getLocalStorage();
    var token = storage.get();

    var name = "";
    var phoneFriend = "";

      $cordovaContacts.find({filter : '', fields:  [ 'displayName']}).then(function(allContacts) { //replace 'Robert' with '' if you want to return all contacts with .find()
          $scope.contacts = allContacts;
          angular.forEach(allContacts, function(item, index){
            if (item.displayName != null && item.phoneNumbers != null) {
              var p = item.phoneNumbers[0].value.replace(/ /g,'');
              var p1 = p.replace(/-/g,'');
              if (p1.startsWith('+')) {

                nameFriend = item.displayName;
                phoneFriend = p1;

                // acessando o recurso de API
                InvitePhoneNumberResource.save({ token: token, name: nameFriend, phone: phoneFriend })
                .$promise
                  .then(function(data) {
                    $scope.Success = true;
                    $scope.msgSuccess =  data.message;
                  },
                  function(error) {
                    $scope.msgError =  error.data.message;
                  });

              }

            }
          });

          goHome();
      });
  };
  // FINAL getAllContacts

  // INIT SEND message
  $scope.sendMessage = function(phoneFriend) {
    var messageTypeId = 0;

    // Acessando o storage local
    var storage = new getLocalStorage();
    var token = storage.get();

    var info = {'token': token, 'phoneFriend': phoneFriend, 'messageTypeId': messageTypeId};
    // acessando o recurso de API
   MessageSendResource.save({}, info)
    .$promise
      .then(function(data) {
        $scope.Success = true;
        $scope.msgSuccess =  data.message;
        showAlert();

      },
      function(error) {
        $scope.error = true;
        $scope.msgError =  error.data.message;
      });
      $state.go("home.friendslist");
  }
  // END SEND message


 // INIT DELETE PHONE - A confirm dialog
 $scope.showDelete = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '<b>' + $rootScope.message.title + '</b>',
     template: $rootScope.message.deletePhone,
     cancelText: $rootScope.message.cancel,
     okText: '<b>'+$rootScope.message.exit+'</b>'
   });

   confirmPopup.then(function(res) {

     // Tudo ok vamos iniciar a troca da senha
     // Acessando o storage local
     var storage = new getLocalStorage();
     var token = storage.get();

     if(res) {
       // removendo a conta
       DeletePhoneResource.delete({ token: token })
        .$promise
        .then(function(data) {

          if (data.code === "200") {
            $state.go("login");
          }

        }, function(error) {
          $scope.error = true;

          if (error.data === null) {
            $scope.msgError = $rootScope.message.deleteError;
          }
          else {
            $scope.msgError =  error.data.message;
          }
       });

       // Acessando o storage local
       storage.remove();


       // redirecionando para o Login
       $state.go("login");
     }
   });
 };
 // END DELETE PHONE


 // INIT EXIT - A confirm dialog
 $scope.showExit = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '<b>' + $rootScope.message.title + '</b>',
     template: $rootScope.message.exitMessage,
     cancelText: $rootScope.message.cancel,
     okText: '<b>'+$rootScope.message.exit+'</b>'
   });

   confirmPopup.then(function(res) {
     if(res) {
       // Acessando o storage local
       var storage = new getLocalStorage();
       storage.remove();

       // redirecionando para o Login
       $state.go("login");
     }
   });
 };
 // END EXIT

 $scope.showAlert = function() {
   $ionicPopup.alert({
     title: 'Success',
     content: 'Hello World!!!'
   }).then(function(res) {
     console.log('Test Alert Box');
   });
 };


});
