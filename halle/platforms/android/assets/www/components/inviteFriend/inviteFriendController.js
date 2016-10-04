var app = angular.module('halleApp.inviteFriendController', []);

// Controller da pagina de criar usuario
app.controller('inviteFriendController', function($scope, $rootScope, $state, $cordovaSocialSharing, $ionicPopup, AnalyticsService) {

  // Registrar Analytics
  AnalyticsService.add('inviteFriendController');

  // Acessando o storage local
  var storage = new getLocalStorage();
  var token = storage.get();

  // Perform the inviteEmail
  $scope.inviteEmail = function() {
    AnalyticsService.trackEvent('inviteFriend', 'Email');

    $scope.data = {};
    // popup email and name friend
    var myPopup = $ionicPopup.show({
      template: '{{message.inviteFriendNameFriend}}<input type="text" ng-model="data.name">'+
                '<br/>'+
                '{{message.inviteFriendEmail}}<input type="text" ng-model="data.email">',
      title: $rootScope.message.inviteFriendFriend,
      scope: $scope,
      buttons: [
        { text: $rootScope.message.cancel },
        {
          text: '<b>'+$rootScope.message.ok+'</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.email || !$scope.data.name) {
              e.preventDefault();
            } else {
              $cordovaSocialSharing
                .shareViaEmail($rootScope.message.inviteFriendMessage, $rootScope.message.inviteFriendSubject, $scope.data.email, null, null, null)
                .then(function(result) {
                }, function(err) {
                });
            }
          }
        }
      ]
    });

  }

  // Perform the inviteWhatsApp
  $scope.inviteWhatsApp = function() {
    AnalyticsService.trackEvent('inviteFriend', 'WhatsApp');

    $cordovaSocialSharing
    .shareViaWhatsApp($rootScope.message.inviteFriendMessage, null, 'http://www.halleapp.net')
    .then(function(result) {
    }, function(err) {
    });
  }

  // Perform the inviteFacebook
  $scope.inviteFacebook = function() {
    AnalyticsService.trackEvent('inviteFriend', 'Facebook');

    $cordovaSocialSharing
      //.shareViaFacebook
      .shareViaFacebookWithPasteMessageHint($rootScope.message.inviteFriendMessage, null, 'http://www.halleapp.net', $rootScope.message.inviteFriendPaste)
      .then(function(result) {
      }, function(err) {
      });
  }


});
