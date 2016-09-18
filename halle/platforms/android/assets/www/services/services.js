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
    //'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNDVlMTA5Zi0wMmVjLTRhOWMtODIyZi04NGM5ZjI4ZWI2OTUifQ.E0pu79GgUCqxuE3K5o1deptmlZtYl_dHd9bHB6WdQz4'
    var req = {
      method: 'POST',
      url: 'https://api.ionic.io/push/notifications',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDVlMTA5Zi0wMmVjLTRhOWMtODIyZi04NGM5ZjI4ZWI2OTUifQ.Jau9agLgBEF7Is9Ap8psadEqtFOVkUzLmsb5FueIhH8'
      },
      data: {
        "tokens": tokenpush,
        "profile": 'halle_prd',
        "notification": {
          "title": "hallə",
          "message": $rootScope.message.messagePush,
          "android": {
            "title": "hallə",
            "priority": "high",
            "message": $rootScope.message.messagePush
          },
          "ios": {
            "title": "hallə",
            "priority": 10,
            "message": $rootScope.message.messagePush
          }
        }
      }
    };

    // Make the API call
    $http(req).success(function(resp){
      // Handle success
      console.log("Ionic Push: Push success", resp);
    }).error(function(error){
      // Handle error
      console.log("Ionic Push: Push error", error);
    });
  }
});


app.service('ForgotPassNotificationService', function($http, $rootScope) {

  this.push = function(tokenpush, password) {
    var req = {
      method: 'POST',
      url: 'https://api.ionic.io/push/notifications',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDVlMTA5Zi0wMmVjLTRhOWMtODIyZi04NGM5ZjI4ZWI2OTUifQ.Jau9agLgBEF7Is9Ap8psadEqtFOVkUzLmsb5FueIhH8'
      },
      data: {
        "tokens": tokenpush,
        "profile": 'halle_prd',
        "notification": {
          "title": $rootScope.message.forgotTitlePush,
          "message": $rootScope.message.forgotPushNewPass + password,
          "android": {
            "title": $rootScope.message.forgotTitlePush,
            "priority": "high",
            "message": $rootScope.message.forgotPushNewPass + password
          },
          "ios": {
            "title": $rootScope.message.forgotTitlePush,
            "priority": 10,
            "message": $rootScope.message.forgotPushNewPass + password
          }
        }
      }
    };

    // Make the API call
    $http(req).success(function(resp){
      // Handle success
      console.log("Ionic Push: Push success", resp);
    }).error(function(error){
      // Handle error
      console.log("Ionic Push: Push error", error);
    });
  }
});





app.service('PhoneService', function() {

  var contato = "";

  this.contactPattern = function(numContato, PadraoDDI, PadraoDDD) {

    /* ------------------------------------------------------
    ddi - DDI padrão dever seguir o seguinte exemplo "55" ( padrão da função 55 - Brasil)
    ddd - DDD padrão dever seguir o seguinte exemplo "11" ( padrão da função 21 - Rio de janeiro)
    numcontato - numero de telefone que será formatado
    --------------------------------------------------------*/

  	"use strict";
  	// validar entrada
  	PadraoDDI = PadraoDDI.replace(/\D/g, "");
  	if (PadraoDDI.length !== 2) {
  		PadraoDDI = "55";
  	}
  	PadraoDDD = PadraoDDD.replace(/\D/g, "");
  	if (PadraoDDD.length!== 2){
  		PadraoDDD = "21";
  	}

  	// Variaveis
    var cel = '';
  	var ddi = '';
  	var ddd =  '';
  	cel = cel.toString();
  	ddd = ddd.toString();
  	ddi = ddi.toString();
  	var pos1 = numContato.indexOf(')');
  	var pos2 = numContato.indexOf('(');
  	var pos3 = numContato.indexOf('+');

  	// Definição do cel, ddd e ddi
  	cel = numContato.substring(pos1 + 1);
  	ddd = numContato.substring(pos2 +1, pos1);
  	if (pos3 > -1){
  		ddi = numContato.substring(pos3, pos3+3);
          } else {
  		ddi = PadraoDDI;
  	}

  	// Limpando a string - so numerico
  	cel = cel.replace(/\D/g, "");
  	ddd= ddd.replace(/\D/g, "");
  	ddi= ddi.replace(/\D/g, "");

	  // Verifica se é telefone fixo
	  if (cel.slice(-8,-7) < 6 ){
		  return  '';
    }

  	// valida o DDD
  	if (pos1 === -1){
  		ddd = cel.slice(-11,-9);
  	}  else  {
  		ddd= ddd.substring(ddd.length-2);
  	}

  	// Define o celular
  	if (cel.length > 9){
  		cel = cel.substring(cel.length-9);
  	}

  	// Define define se vai acrescentar 9 no CELULAR
  	if (cel.length === 8 && ddd==="" ){
  		cel = '9' + cel;
  	}

  	// Veirifica se o DDD ou o DDI não existem
  	if	(ddd.length!= 2){
  		ddd = PadraoDDD;
  	}
  	if	(ddi.length!= 2){
  		ddi = PadraoDDI;
  	}

  	// Preparando a entrega
  	var contato = '+' + ddi + ddd + cel;
  	if (contato.length <13 || contato.length >14) {
	    contato ='';
    }
    return contato;


    return '+' + contato;
  }

  return contato;
});

app.service('BadgeService', function($cordovaBadge) {
  this.set = function(count) {
    try {
        $cordovaBadge.hasPermission().then(function(yes) {
          // You have permission
          $cordovaBadge.set(count).then(function() {
            // You have permission, badge set.
          }, function(err) {
            console.log('BadgeService - ' + err);
          });
        }, function(no) {
          // You do not have permission
          console.log('BadgeService hasPermission - ' + no);
        });
    }
    catch(e) {}
  };
});

app.service('AnalyticsService', function($cordovaGoogleAnalytics) {
  this.add = function(page) {
    if(typeof analytics !== 'undefined'){
      //console.log("Google Analytics disponivel - " + page);
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-83331611-1');
      $cordovaGoogleAnalytics.trackView(page);
    }
    else {
      //console.log("Google Analytics indisponivel - " + page);
    }
  };
});
