var app = angular.module('halleApp.feedbackController', []);

// Controller da pagina de criar usuario
app.controller('feedbackController', function($scope, $rootScope, $state, $http, FeedbackResource) {

  // Form data
  $scope.data = {};

  // Perform the submit
  $scope.onSubmit = function() {
    // mensagem de erro
    $scope.error = false;
    $scope.msgError = "";
    // mensagem de sucesso
    $scope.sucess = false;
    $scope.msgSucess = "";

    // atributos
    var subject = $scope.data.subject;
    var description = $scope.data.description;

    // Validação
    if ($scope.data.$valid) {
      $scope.msgError = $rootScope.message.feedbackRequired;
    }
    // description
    if (description == null) {
      $scope.msgError = $rootScope.message.feedbackDescriptionRequired;
    }
    else if (description.length > 5000) {
          $scope.msgError = $rootScope.message.feedbackDescriptionMaxlength;
    }

    // subject
    if (subject == null) {
      $scope.msgError = $rootScope.message.feedbackSubjectRequired;
    }
    else if (subject.length > 500) {
        $scope.subject = $rootScope.message.feedbacksubjectMaxlength;
    }

    if ($scope.msgError != "") {
      $scope.error = true;
    }
    else {
      // Acessando o storage local
      var storage = new getLocalStorage();
      var token = storage.get();

      var info = {'token': token, 'subject': subject, 'description': description};
      // acessando o recurso de API
     FeedbackResource.save({}, info)
      .$promise
        .then(function(data) {
          $scope.sucess = true;
          $scope.msgSucess =  data.message;
        },
        function(error) {
          $scope.error = true;
          $scope.msgError =  error.data.message;
        });
    }

  }
});
