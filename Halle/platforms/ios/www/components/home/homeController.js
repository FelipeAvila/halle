var app = angular.module('halleApp.homeController', []);

// Controler da pagina incial
app.controller('homeController', function($scope, $rootScope, $ionicPopup, $ionicLoading, $state, $stateParams, $cordovaContacts, $ionicPlatform, DeletePhoneResource, InvitePhoneNumberResource, MessageReceiveResource) {
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

          var phoneFriend = ContatoPadrao(item.phoneNumbers[0].value, ddiPadrao, dddPadrao);

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

    };
    function onError(contactError) {
    };
    var options = {};
    options.multiple = true;
    $cordovaContacts.find(options).then(onSuccess, onError);
  };
  // FINAL getAllContacts

  function ContatoPadrao(numContato, ddi, ddd) {
       /* ------------------------------------------------------
       ddi - DDI padrão dever seguir o seguinte exemplo "+55" ( padrão da função +55 - Brasil)
       ddd - DDD padrão dever seguir o seguinte exemplo "11" ( padrão da função +21 - Rio de janeiro)
       numcontato - numero de telefone que será formatado
      --------------------------------------------------------*/
      "use strict";
      var cel, contato = "";
      //alert(numContato);

      /* ------------------------------------------------------
         Tratamento do ddd
      --------------------------------------------------------*/
      if (ddd.length > 2) {
          ddd = ddd.slice(-2);
      }
      if (ddd.length < 2) {
          ddd = '21';     // ddd padrao
      }

      /* ------------------------------------------------------
          Tratamento do ddi
      --------------------------------------------------------*/
      if (ddi.length === 2) {
          ddi = '+' + ddi;
      }
      if (ddi.length !== 3 || ddi.substring(0,1) != '+') {
           ddi = '+55';
      }

      /* ------------------------------------------------------
          Tratamento do contato
      --------------------------------------------------------*/

      // Vericar se o DDI existe no contato identificando o +
      if (numContato.substring(0,1) == "+"){
          ddi = numContato.substring(0,3);
          numContato=numContato.substring(3,100);
      }

      // Limpar a string do contato e manter apenas numero
      var pos;
      var i =0;
      for (i = 0; i < numContato.length; i++) {
          pos = numContato.substring (i,i+1);
          if ( !isNaN(pos) && pos != " " ){
              contato = contato + pos;
          }
      }

      //contato= limparContato(numContato);
      switch (contato.length) {
      case  8:
          cel = contato;
          break;
      case  9:
          cel = contato;
          break;
      case 10:     // tratamento 8 digitos
          cel = contato.slice(-8);
          ddd = contato.slice(-10,-8);
          break;
      case 13:     // tratamento 8 digitos
          cel = contato.slice(-8);
          ddd = contato.slice(-10, -8);
          break;
      case 12:
          cel = contato.slice(-9);
          ddd = contato.slice(-11, -9);
          break;
      case 14:
          cel = contato.slice(-9);
          ddd = contato.slice(-11, -9);
          break;
      case 11:
          if (contato.substring(0,1) == "0"){
              cel = contato.slice(-8);          // tratamento 8 digitos
              ddd = contato.slice(-10, -8);
          } else {
              cel = contato.slice(-9);
              ddd = contato.slice(-11, -9);
          }
          break;
      }
      contato= ddi + ddd + cel;
      return contato;
  }


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
