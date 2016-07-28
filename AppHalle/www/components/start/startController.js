var app = angular.module('halleApp.startController', []);

// Controler da pagina de start
app.controller('startController', function($scope, $rootScope, $timeout, $ionicLoading, $state, $location, ValidTokenResource) {
   // Setup the loader
   $ionicLoading.show({
     content: '',
     template : '<div class="spacer" style="width: auto; height: 250px;"></div><i class="ion-loading-c">espalhe <strong>A paz do Senhor</strong> no mundo</i>',
     animation: 'fade-in',
     showBackdrop: true,
     maxWidth: 200,
     showDelay: 0
   });

   $timeout(function () {
     $ionicLoading.hide();
   }, 2000);

   // Acessando o storage local
   var storage = new getLocalStorage();
   if (storage.get() === null) {
     $state.go("login");
   }
   else {
       // acessando o recurso de API
      // INICIO
      ValidTokenResource.get({ token: storage.get() })
       .$promise
       .then(function(data) {

         if (data.code === "200") {
           $state.go("home.friendslist");
         }
         else {
           $scope.msgError =  data.message;
         }

       }, function(error) {
         $scope.error = true;

         if (error.data === null) {
           $scope.msgError = $rootScope.message.loginError;
         }
         else {
           $scope.msgError =  error.data.message;
         }
         $state.go("login");

      });
      // final
   }


});
