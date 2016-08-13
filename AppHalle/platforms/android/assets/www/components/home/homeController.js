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

          var phoneFriend = Validar(item.phoneNumbers[0].value);

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

  function Validar(Contato) {
    var dddOrigem = $rootScope.phone.substring(3,5);;
    var retorno = ContatoPadrao(dddOrigem,Contato);
    return retorno;
  }

  function ContatoPadrao(dddPadrao,numContato){
    var ddd ="";
    var ddi = $rootScope.phone.substring(0,3);
    var cel = "";
    var contato="";
    if (numContato.substring(0,1) == "+"){
        ddi =numContato.substring(0,3);
        numContato=numContato.substring(3,100);
    }
    contato= limparContato(numContato);

    if (contato.length <= 9){
      cel = contato;
      ddd = dddPadrao;
    }

    if (contato.length == 10 || contato.length == 13 ){
      cel = contato.slice(-8);
      ddd = contato.slice(-10,-8);
    }

    if ( contato.length == 12 || contato.length == 14){
      cel = contato.slice(-9);
      ddd = contato.slice(-11,-9);
    }

    if (contato.length == 11  ){
      if (contato.substring(0,1) == "0"){
        cel = contato.slice(-8);
        ddd = contato.slice(-10,-8);
      }else{
        cel = contato.slice(-9);
        ddd = contato.slice(-11,-9);
      }
    }
    return ddi+ddd+cel;
   }

   function limparContato(str){
    var pos;
    var saida="";
    for (i = 0; i < str.length; i++) {
      pos= str.substring(i,i+1);
      if (!isNaN(pos) && pos!=" "){
        saida = saida + pos;
      }
    }
    return saida;
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
