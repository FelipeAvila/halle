var app = angular.module('halleApp.homeController', []);

// Controler da pagina incial
app.controller('homeController', function($scope, $rootScope, $ionicPopup, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource) {
  $scope.contacts = {};

  $scope.getAllContacts = function() {
    $cordovaContacts.find().then(function(allContacts) {
      $scope.contacts = allContacts;
      console.log(JSON.stringify(allContacts));
    });
  };

 // INIT POPUP INVITE CONTACTS
 // An elaborate, custom popup
 $scope.showInvite = function() {

   console.log('showInvite - ');

   console.log('showInvite - ' + $scope.contacts);


  var myPopup = $ionicPopup.show({
    template: '<ion-list>                                '+
              '  <ion-item ng-repeat="con in getAllContacts().find()">  '+
              '    {{con.name}}                          '+
              '  </ion-item>                             '+
              '</ion-list>                               ',
    title: $rootScope.message.inviteContacts,
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return;
          }
        }
      }
    ]
  });
 };
 // FINISH POPUP INVITE CONTACTS

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

});
