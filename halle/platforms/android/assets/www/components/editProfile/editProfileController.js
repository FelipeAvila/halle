var app = angular.module('halleApp.editProfileController', []);

// Controller da pagina de criar usuario
app.controller('editProfileController', function($scope, $rootScope, $state, $cordovaCamera, FindUserResource, EditUserResource, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('editProfileController');

  // Form data
  $scope.data = {};
  // mensagem de erro
  $scope.error = false;
  $scope.msgError = "";
  // mensagem de OK
  $scope.Success = false;
  $scope.msgSuccess = "";
  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // Inicio onload
  $scope.onLoad = function() {
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
  // final onload

  // inicio onSubmit
  $scope.onSubmit = function() {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de OK
    $scope.Success = false;
    $scope.msgSuccess = "";

    // atributos
    var name = $scope.data.name;
    var nickname = $scope.data.nickname;
    var birthday = $scope.data.birthday;
    var email = $scope.data.email;
    var photo = $scope.data.photo;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.editProfileInvalid;
    }
    // subject
    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
      var info = {'token': token, 'name': name, 'nickname': nickname, 'birthday': birthday, 'email': email, 'photo': photo};
      // acessando o recurso de API
     EditUserResource.save({}, info)
      .$promise
        .then(function(data) {
          $scope.Success = true;
          $scope.msgSuccess =  data.message;
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
  // final onSubmit

  // inicio upload
  $scope.photo = function() {
    var options = {
        quality: 60,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 250,
        targetHeight: 250,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
       //var srcImage = "data:image/jpeg;base64," + imageData;
       $scope.data.photo = imageData;
    }, function(err) {
        // error
    });
  }
  // final upload

});
