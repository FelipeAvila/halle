var app = angular.module('halleApp.services', ['ngResource']);

/*****************Serviços *********************************/
app.service('AuthService', function($q, AuthResource) {
  var item = "";

  this.send = function(login, password) {
     AuthResource.save({ login: login, password: password })
        .$promise
          .then(function(data) {
            item = data.toJSON();
          });
     return item;
  };
});

app.service('PushNotificationService', function($http, $rootScope) {

  // Acessando o storage local
  var storage = new getLocalStorage();
  // get Token
  var token = storage.get();

  this.push = function(tokenpush) {
    var req = {
      method: 'POST',
      url: 'https://api.ionic.io/push/notifications',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MjNmOWQwNi1lMzYyLTRiNDQtOTgxNS1kZTdiNzJlMGNlMGYifQ.m8V5tWwKblAi2EJwRgCmJoWD1i4Jmd8uCo8Vi1Az2k8'
      },
      data: {
        "tokens": tokenpush,
        "profile": 'halle',
        "notification": {
          "message": $rootScope.message.messagePush,
          "android": {
            "icon": "ic_logo",
            "message": $rootScope.message.messagePush
          },
          "ios": {
            "message": $rootScope.message.messagePush
          }
        }
      }
    };

    // Make the API call
    $http(req).success(function(resp){
      // Handle success
      //console.log("Ionic Push: Push success", resp);
    }).error(function(error){
      // Handle error
      console.log("Ionic Push: Push error", error);
    });
  }
});

app.service('PhoneService', function() {

  var contato = "";
  this.contactPattern = function(numContato, ddi, ddd) {
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
     default:
         cel='';
     }
     contato= ddi + ddd + cel;
     if (contato.length <13 || contato.length >14) {
        contato ='';
     }

     return contato;
  }
  return contato;
});

app.service('BadgeService', function($cordovaBadge) {
  this.set = function(count) {
    console.log('BadgeService - ' + count);
    $cordovaBadge.hasPermission().then(function(yes) {
      // You have permission
      console.log('BadgeService - ' + yes);
    }, function(no) {
      // You do not have permission
      console.log('BadgeService - ' + no);
    });

    $cordovaBadge.set(count).then(function() {
      // You have permission, badge set.
    }, function(err) {
      console.log('BadgeService - ' + err);
    });
  };
});
