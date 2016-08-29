var app = angular.module('halleApp.homeController', []);

// Controler da pagina incial
app.controller('homeController', function($scope, $rootScope, $ionicPopup, $ionicLoading, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource, InvitePhoneNumberResource, MessageReceiveResource, PhoneService) {

  /*
  //Analytics
  if(typeof analytics !== undefined) {
      analytics.trackView("homeController");
  }
  */

  $scope.contacts = {};
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // INIT home
  $scope.goHome = function() {
    $state.go("home.friendslist");
  }
  // FINAL home

  // INIT
  $scope.goMessage = function() {
    if ($rootScope.amountMessage > 0) {
      $state.go("home.message");
    }
    else {
      $ionicPopup.alert({
        title: $rootScope.message.title,
        content: $rootScope.message.messageAmount
      }).then(function(res) {
        return;
      });
    }
  }
  // FINAL


  // INIT getAllContacts
  $scope.getAllContacts = function() {
    var name = "";
    var phoneFriend = "";
    var nameFriend = "";

    $scope.phoneContacts = [];

    function onSuccess(contacts) {
      for (var i = 0; i < contacts.length; i++) {
        var item = contacts[i];

        // carregando o nome.
        nameFriend = "";
        if (item.displayName != null) {
          nameFriend = item.displayName;
        } else if (item.nickname != null) {
          nameFriend = item.nickname;
        } else if (item.name.givenName) {
          nameFriend = item.name.givenName;
        } else {
          nameFriend = item.name.formatted;
        }

        if (nameFriend != null && item.phoneNumbers != null) {

          var ddiPadrao = $rootScope.phone.substring(0,3);
          var dddPadrao = $rootScope.phone.substring(3,5);;

          var phoneFriend = PhoneService.contactPattern(item.phoneNumbers[0].value, ddiPadrao, dddPadrao);
          if (phoneFriend != "") {
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
      }

    };
    function onError(contactError) {
    };

    var options = {};
    options.multiple = true;
    $cordovaContacts.find(options).then(onSuccess, onError);

  };
  // FINAL getAllContacts

  // Inicio importação de contatos
  $scope.importContacts = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '<b>' + $rootScope.message.title + '</b>',
      template: $rootScope.message.importContacts,
      cancelText: $rootScope.message.cancel,
      okText: '<b>'+$rootScope.message.confirm+'</b>'
    });

    confirmPopup.then(function(res) {
      // Tudo ok vamos iniciar a troca da senha

      if(res) {
        $scope.getAllContacts();
      }
    });

  }
  // final importação de contatos

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
       storage.remove();

       // redirecionando para o Login
       $state.go("login");
     }
   });
 };
 // END EXIT

});
