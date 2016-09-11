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
          "title": "halle",
          "message": $rootScope.message.messagePush,
          "android": {
            "title": "halle",
            "priority": "high",
            "message": $rootScope.message.messagePush
          },
          "ios": {
            "title": "halle",
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

app.service('PhoneService', function() {

  var contato = "";

  this.contactPattern = function(numContato, PadraoDDI, PadraoDDD) {
      /* ------------------------------------------------------
      ddi - DDI padrão dever seguir o seguinte exemplo "+55" ( padrão da função +55 - Brasil)
      ddd - DDD padrão dever seguir o seguinte exemplo "11" (padrão da função   21 - Rio de janeiro)
      numcontato - numero de telefone que será formatado
     --------------------------------------------------------*/
    "use strict";
     var cel, contato, ddi, ddd = "";

     numContato =numContato.trim();
     // Vericar se o DDI existe no contato identificando o +  ou usa o ddi padrao
     if (numContato.substring(0, 1) === "+") {
         ddi = numContato.substring(0,3);
         numContato=numContato.substring(3,100);
     } else
     {
       ddi = this.DDILimpo(PadraoDDI);
     }

     // Limpar a string do contato e manter apenas numero
     contato = this.numerico(numContato);

     // só trata contato com + de 8 digitos
     if (contato.length < 8) {
       return "";
     }

     // tratamento do contato
     switch (contato.length) {
       case  8:
        cel = "9" + contato;
        break;
       case  9:
         cel = contato;
         break;
       case 10:     // tratamento 8 digitos  (31) 9876-0000
         cel = contato.slice(-8);
         ddd = contato.slice(-10,-8);
         var retval = this.ValidarDDD(ddd);
         if(retval=="false"){
          cel = "";
         }
         break;
       case 13:     // tratamento 8 digitos (021 12) 9876-0000
         cel = contato.slice(-8);
         ddd = contato.slice(-10, -8);
         break;
       case 12:    // tratamento de 9 digitos (021) 98768-0000
         cel = contato.slice(-9);
         ddd = contato.slice(-11, -9);
         break;
       case 14:   // tratamento de 9 digitos (015 21) 98768-0000
         cel = contato.slice(-9);
         ddd = contato.slice(-11, -9);
         break;
       case 11:   // tratamento de 8 ou 9 digitos - 8 digitos (021) 9876-0000  9 digitos (21) 98769-0000
         if (contato.substring(0,1) == "0"){
           cel = contato.slice(-8);          // tratamento 8 digitos
           ddd = contato.slice(-10, -8);
         } else {
           cel = contato.slice(-9);
           ddd = contato.slice(-11, -9);
         }
         break;
       default: // tratamento de 9 digitos default
         cel = contato.slice(-9);
         ddd = contato.slice(-11, -9);
     }

     /*-------------------------------------------------------
     Validando DDD
     --------------------------------------------------------*/

     if (ddd === ""){
       ddd = PadraoDDD;
     }
     ddd= this.DDDLimpo(ddd);

    /* ------------------------------------------------------
         Elimina telefone fixo. Só fica numero que
     inicia com 8 ou 9
     --------------------------------------------------------*/

     if (cel.slice(-8, -7) < 6 ){
       return "";
     }

     ddd= this.DDDLimpo(ddd);
     contato = ddi + ddd + cel;
     contato = this.numerico(contato);

     if (contato.length <12 || contato.length >13) {
       contato ='';
     }

    return '+' + contato;
  }

  /* ------------------------------------------------------
         Tratamento DDI
  	   entrada ddi - valida o formato "+nn" ( padrão da função +55 - Brasil)
  -------------------------------------------------------- */
  this.DDILimpo = function(ddi) {
  	var ddinumero = "";
  	if (ddi.length !== 3 ||
  		ddi.substring(0,1)!='+'){
  		return "+55";    // padrão da função
  	}
  	ddinumero = this.numerico(ddi.substring(1,3));
  	ddinumero = "+"+ ddinumero;
  	if (ddinumero.length !== 3){
  		ddinumero = "+55";
  	}
  	return ddinumero;
  }


  /* ------------------------------------------------------
      Tratamento DDD
  	 ddd - valida o formato "nn" (padrão da função   21 - Rio de janeiro)
  --------------------------------------------------------  */
  this.DDDLimpo = function(ddd) {

  	var saida = this.numerico(ddd);
  	if (saida.length != 2) {
  	    saida = "21";
      }
  	if (saida.substring(0,1)=="0"){
  		saida = "21";
  	}
  	if (saida.substring(1,2)=="0"){
  		saida = "21";
  	}
    return saida;
  }
  /* ------------------------------------------------------
      Valida o formato do DDD  => "nn"
  	verifica se tem duas posições numericas
  	Retorna false se o primeiro numero for 0
  --------------------------------------------------------  */
  this.ValidarDDD = function(ddd) {
  	var saida = "false";
  	ddd = this.numerico(ddd);
  	if (ddd.length === 2) {
  	     saida = "true";
      }
  	if (ddd.substring(0,1)=="0"){
  		  saida = "false";
  	}
      return saida;
  }

  /* ------------------------------------------------------
     Retira tudo, só deixa numero
  --------------------------------------------------------*/

  this.numerico = function(inTexto) {
  	var pos;
  	var saida= "";
      var i =0;
      for (i = 0; i < inTexto.length; i++) {
          pos = inTexto.substring (i,i+1);
          if ( !isNaN(pos) && pos != " " ){
              saida = saida + pos;
          }
      }
  	return saida;

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
