var app = angular.module('halleApp.homeController', []);

app.controller('homeController', function($scope, $rootScope, $ionicPopup, $ionicLoading, $ionicScrollDelegate, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource, InvitePhoneNumberResource, MessageReceiveResource, PhoneService, AnalyticsService, FeedbackResource, GetAllContactsService) {

  // Registrar Analytics
  AnalyticsService.add('homeController');

  $scope.searchValue="";

  $scope.contacts = {};

  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // INIT home
  $scope.goHome = function() {
    $ionicScrollDelegate.scrollTop();
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
    GetAllContactsService.run();
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
       storage.removeFriendList();
       storage.removeContactList();
       storage.removeInfoUsuario();

       // redirecionando para o Login
       $state.go("login");
     }
   });
 };
 // END EXIT

});
