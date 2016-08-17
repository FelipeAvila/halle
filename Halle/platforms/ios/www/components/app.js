// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('halleApp', ['ionic', 'intlpnIonic', 'ngCordova', 'ngResource', 'halleApp.homeController', 'halleApp.startController', 'halleApp.loginController', 'halleApp.createUserController', 'halleApp.forgotController', 'halleApp.invitePhoneController', 'halleApp.changePasswordController', 'halleApp.friendsListController', 'halleApp.feedbackController', 'halleApp.editProfileController', 'halleApp.messageController', 'halleApp.inviteFriendController', 'halleApp.resources', 'halleApp.services']);

/***************Configuração Inicial *************************/
// estados
app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'index.html'
    })
    .state('start', {
      url: '/start',
      templateUrl: 'components/start/start.html',
      controller: 'startController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'loginController'
    })
    .state('createUser', {
      url: '/createUser',
      templateUrl: 'components/createUser/createUser.html',
      controller: 'createUserController'
    })
    .state('forgot', {
      url: '/forgot',
      templateUrl: 'components/forgotPassword/forgot.html',
      controller: 'forgotController'
    })
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'components/home/home.html',
      controller: 'homeController'
    })
    .state('home.friendslist', {
      url: '/friendslist',
      views: {
        'menuContent' :{
          templateUrl: 'components/friends/friendslist.html',
          controller: 'friendsListController'
        }
      }
    })
    .state('home.invitePhone', {
      url: '/invitePhone',
      views: {
        'menuContent' :{
          templateUrl: 'components/invitePhone/invitePhone.html',
          controller: 'invitePhoneController'
        }
      }
    })
    .state('home.changePassword', {
      url: '/changePassword',
      views: {
        'menuContent' :{
          templateUrl: 'components/changePassword/changePassword.html',
          controller: 'changePasswordController'
        }
      }
    })
    .state('home.feedback', {
      url: '/feedback',
      views: {
        'menuContent' :{
          templateUrl: 'components/feedback/feedback.html',
          controller: 'feedbackController'
        }
      }
    })
    .state('home.editProfile', {
      url: '/editProfile',
      views: {
        'menuContent' :{
          templateUrl: 'components/editProfile/editProfile.html',
          controller: 'editProfileController'
        }
      }
    })
    .state('home.message', {
      url: '/message',
      views: {
        'menuContent' :{
          templateUrl: 'components/message/message.html',
          controller: 'messageController'
        }
      }
    })
    .state('home.inviteFriend', {
      url: '/inviteFriend',
      views: {
        'menuContent' :{
          templateUrl: 'components/inviteFriend/inviteFriend.html',
          controller: 'inviteFriendController'
        }
      }
    })


    $urlRouterProvider.otherwise('/start');
});

/******************Execução Inicial*****************************/
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("My Device token:",token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
  });
})

// verificando a conectividade
app.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});

// Carregando o resource bundle
app.run(function($http, $rootScope) {
  $http.get('i18n/pt-BR.json')
      .success(function(data, status, headers, config) {
        $rootScope.message = data;
  });
});
