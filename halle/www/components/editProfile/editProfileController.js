var app = angular.module('halleApp.editProfileController', []);

// Controller da pagina de criar usuario
app.controller('editProfileController', function($scope, $rootScope, $state, $timeout, $ionicActionSheet, $cordovaCamera, FindUserResource, EditUserResource, AnalyticsService) {

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
          if ($scope.data.birthday != null) {
            $scope.data.birthday = new Date($scope.data.birthday);
          }
          else {
            $scope.data.birthday = new Date();
          }
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
    var nickname = $scope.data.name; //$scope.data.nickname;
    var birthday = new Date(); //$scope.data.birthday;
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
          if (error.status == '404') {
            $scope.msgError = $rootScope.message.error404;
          }
          else if (error.data) {
            $scope.msgError =  error.data.message;
          }
          else {
            $scope.msgError =  $rootScope.message.editProfileError;
          }
        });
    }
  }
  // final onSubmit

  // inicio foto
  $scope.photo = function() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 150,
        targetHeight: 150,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
       //var srcImage = "data:image/jpeg;base64," + imageData;
       $scope.data.photo = imageData;
    }, function(err) {
        // error
    });
  }
  // final foto

  // inicio upload
  $scope.upload = function() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 150,
        targetHeight: 150,
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

  // Triggered on a button click, or some other target
  $scope.show = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-android-camera halle"></i>' + $rootScope.message.editProfilePhoto },
        { text: '<i class="icon ion-share halle"></i>' + $rootScope.message.editProfileUpload }
      ],
      titleText: '<b>' + $scope.data.photo == null?$rootScope.message.editProfileAddPhoto:$rootScope.message.editProfileChagePhoto + '</b>',
      destructiveText: $rootScope.message.cancel,
      cancelText: $rootScope.message.cancel,
      cancel: function() {
           // add cancel code..
         },
      buttonClicked: function(index) {
        //console.log('BUTTON CLICKED', index);
        if (index == 0) {
          $scope.photo();
        }
        else {
          $scope.upload();
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //console.log('DESTRUCT');
        return true;
      }
    });

    $timeout(function() {
      hideSheet();
    }, 9000);

  };

});
