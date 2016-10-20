var app = angular.module('halleApp.startController', []);

// Controler da pagina de start
app.controller('startController', function($scope, $rootScope, $timeout, $ionicLoading, $state, $location, ValidTokenResource, AnalyticsService) {

    // Registrar Analytics
    AnalyticsService.add('startController');

    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de OK
    $scope.Success = false;
    $scope.msgSuccess = "";

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
    }, 500);

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
             $state.go("tratarLogin");
           }

         }, function(error) {
           $state.go("tratarLogin");

        });
        // final
    }
});
