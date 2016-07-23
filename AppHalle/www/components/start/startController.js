var app = angular.module('halleApp.startController', []);

// Controler da pagina de start
app.controller('startController', function($scope, $timeout, $ionicLoading, $state, $location) {
   // Setup the loader
   $ionicLoading.show({
     content: '',
     template : '<div class="spacer" style="width: auto; height: 250px;"></div><i class="ion-loading-c">espalhe <strong>A paz do Senhor</strong> no mundo</i>',
     animation: 'fade-in',
     showBackdrop: true,
     maxWidth: 200,
     showDelay: 0
   });

   // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
   $timeout(function () {
     $ionicLoading.hide();
   }, 2000);

   // Acessando o storage local
   var storage = new getLocalStorage();

   if (storage.get() != null) {
     $state.go("home.friendslist");
   }
   else {
     $state.go("login");
   }
});
