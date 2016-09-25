// Ionic Starter App
var app = angular.module('halleApp', ['ionic', 'ionic.ion.autoListDivider', 'intlpnIonic', 'ngCordova', 'ngResource', 'halleApp.homeController', 'halleApp.startController', 'halleApp.loginController', 'halleApp.createUserController', 'halleApp.forgotController', 'halleApp.invitePhoneController', 'halleApp.changePasswordController', 'halleApp.friendsListController', 'halleApp.feedbackController', 'halleApp.editProfileController', 'halleApp.messageController', 'halleApp.inviteFriendController', 'halleApp.errorMessageController', 'halleApp.welcomeController', 'halleApp.resources', 'halleApp.services']);

/***************Configuração Inicial *************************/
// estados
app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('index', {
      cache: true,
      url: '/',
      templateUrl: 'index.html'
    })
    .state('start', {
      cache: true,
      url: '/start',
      templateUrl: 'components/start/start.html',
      controller: 'startController'
    })
    .state('login', {
      cache: true,
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'loginController'
    })
    .state('createUser', {
      cache: true,
      url: '/createUser',
      templateUrl: 'components/createUser/createUser.html',
      controller: 'createUserController'
    })
    .state('welcome', {
      cache: true,
      url: '/welcome',
      templateUrl: 'components/welcome/welcome.html',
      controller: 'welcomeController'
    })
    .state('forgot', {
      cache: true,
      url: '/forgot',
      templateUrl: 'components/forgotPassword/forgot.html',
      controller: 'forgotController'
    })
    .state('home.invitePhone', {
      cache: true,
      url: '/invitePhone',
      views: {
        'menuContent' :{
          templateUrl: 'components/invitePhone/invitePhone.html',
          controller: 'invitePhoneController'
        }
      }
    })
    .state('home.changePassword', {
      cache: true,
      url: '/changePassword',
      views: {
        'menuContent' :{
          templateUrl: 'components/changePassword/changePassword.html',
          controller: 'changePasswordController'
        }
      }
    })
    .state('home.feedback', {
      cache: true,
      url: '/feedback',
      views: {
        'menuContent' :{
          templateUrl: 'components/feedback/feedback.html',
          controller: 'feedbackController'
        }
      }
    })
    .state('home.editProfile', {
      cache: true,
      url: '/editProfile',
      views: {
        'menuContent' :{
          templateUrl: 'components/editProfile/editProfile.html',
          controller: 'editProfileController'
        }
      }
    })
    .state('home.message', {
      cache: false,
      url: '/message',
      views: {
        'menuContent' :{
          templateUrl: 'components/message/message.html',
          controller: 'messageController'
        }
      }
    })
    .state('home.inviteFriend', {
      cache: true,
      url: '/inviteFriend',
      views: {
        'menuContent' :{
          templateUrl: 'components/inviteFriend/inviteFriend.html',
          controller: 'inviteFriendController'
        }
      }
    })
    .state('home.errorMessage', {
      cache: true,
      url: '/errorMessage',
      views: {
        'menuContent' :{
          templateUrl: 'components/error/errorMessage.html',
          controller: 'errorMessageController'
        }
      }
    })
    .state('home', {
      url: "/home",
      abstract: true,
      templateUrl: 'components/home/home.html',
      controller: 'homeController'
    })
    .state('home.friendslist', {
      url: "/friendslist",
      views: {
        'menuContent': {
          templateUrl: 'components/friends/friendslist.html',
          controller: 'friendsListController'
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

//PUSH
app.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug": false
    });

    push.register(function(token) {
      console.log("My Device token:",token.token);
      console.log("My Device token (TOKEN):",token);
      $rootScope.tokenpush = token.token;
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
  });
})

app.run(function($ionicPlatform, $interval, $rootScope, LoadFriendsService) {
  $ionicPlatform.ready(function() {

      // Iniciar o carregamento das mensagem recebidas
      $rootScope.promiseMessage = null;

      document.addEventListener("pause", function() {
          console.log("The application is pausing from the background");
          loadMessageReceive();
      }, false);

      document.addEventListener("resume", function() {
          console.log("The application is resuming from the background");
          $interval.cancel($rootScope.promiseMessage);
      }, false);

      // Carregando as mensagens
      this.loadMessageReceive = function() {
        LoadFriendsService.runFriends();

        $rootScope.promisseMessage = $interval(function(){
          LoadFriendsService.runFriends();
          LoadFriendsService.runContacts();
        }, 300000); // 5 minutos
      }
  });
});


// Carregando o resource bundle
app.run(function($http, $rootScope) {
  $http.get('i18n/pt-BR.json')
      .success(function(data, status, headers, config) {
        $rootScope.message = data;
  });
});
