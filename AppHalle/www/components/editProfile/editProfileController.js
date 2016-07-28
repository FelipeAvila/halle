var app = angular.module('halleApp.editProfileController', []);

// Controller da pagina de criar usuario
app.controller('editProfileController', function($scope, $rootScope, $state, $http, FindUserResource, EditUserResource) {

  // Form data
  $scope.data = {};

  $scope.onLoad = function() {

    // Acessando o storage local
    var storage = new getLocalStorage();
    var token = storage.get();

    // acessando o recurso de API
   FindUserResource.get({ token: token })
    .$promise
      .then(function(data) {
          $scope.data = data;
          $scope.data.birthday = new Date($scope.data.birthday);
      },
      function(error) {
        $scope.error = true;
        $scope.msgError =  error.data.message;
      });
  }

  // Perform the submit action
  $scope.onSubmit = function() {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de sucesso
    $scope.sucess = false;
    $scope.msgSucess = "";

    // atributos
    var name = $scope.data.name;
    var nickname = $scope.data.nickname;
    var birthday = $scope.data.birthday;
    var email = $scope.data.email;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.editProfileInvalid;
    }
    // subject
    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
      // Acessando o storage local
      var storage = new getLocalStorage();
      var token = storage.get();

      var info = {'token': token, 'name': name, 'nickname': nickname, 'birthday': birthday, 'email': email};
      // acessando o recurso de API
     EditUserResource.save({}, info)
      .$promise
        .then(function(data) {
          $scope.sucess = true;
          $scope.msgSucess =  data.message;
        },
        function(error) {
          $scope.error = true;
          if (error.data) {
            $scope.msgError =  error.data.message;
          }
          else {
            $scope.msgError =  $rootScope.message.editProfileError;
          }
        });
    }
  }
});
