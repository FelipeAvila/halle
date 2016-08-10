var app = angular.module('halleApp.homeController', []);

// Controler da pagina incial
app.controller('homeController', function($scope, $rootScope, $ionicPopup, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource, InvitePhoneNumberResource, MessageReceiveResource) {
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

  // INIT getAllContacts
  $scope.getAllContacts = function() {

    var name = "";
    var phoneFriend = "";
    var nameFriend = "";

    $scope.phoneContacts = [];
    function onSuccess(contacts) {
      alert('Passo 1 - onSucess');
      alert('Passo 2 - ' + contacts.length);
      for (var i = 0; i < contacts.length; i++) {
        //alert('Passo 4 - ' + JSON.stringify(contacts[i]));
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

          var p = item.phoneNumbers[0].value.replace(/ /g,'');
          var p1 = p.replace(/-/g,'');

          if (!p1.startsWith('+')) {
            alert('Passo 3 - (TELEFONE INVALIDO) - ' + nameFriend + ' - ' + p1);
          }

          if (p1.startsWith('+')) {
            alert('Passo 4 - (TELEFONE VALIDO) - ' + nameFriend + ' - ' + p1);

            phoneFriend = p1;

            // acessando o recurso de API
            InvitePhoneNumberResource.save({ token: token, name: nameFriend, phone: phoneFriend })
            .$promise
              .then(function(data) {
                $scope.Success = true;
                $scope.msgSuccess =  data.message;
                alert('Importado - ' + nameFriend + ' - ' + phoneFriend);
            },
            function(error) {
              $scope.msgError =  error.data.message;
              alert('Erro na importação - ' + error);
            });
          }
        }
      }
    };
    function onError(contactError) {
      alert(contactError);
    };
    var options = {};
    options.multiple = true;
    $cordovaContacts.find(options).then(onSuccess, onError);


     /*

      $cordovaContacts.find(opts).then(function(allContacts) {
          $scope.contacts = allContacts;

          alert(allContacts.length);
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
      });
      */
  };
  // FINAL getAllContacts



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
