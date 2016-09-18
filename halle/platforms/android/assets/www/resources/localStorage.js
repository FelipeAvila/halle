function getLocalStorage() {

  /**** localStorage token ****/
  var token = "";

  this.save = function(item) {
      localStorage.setItem('token-halle', item);
  }

  this.remove = function(item) {
      localStorage.removeItem('token-halle');
  }

  this.get = function() {
      token = localStorage.getItem('token-halle');
      return token;
  }

  /**** localStorage lista de amigos ****/

  var friendList = "";

  this.saveFriendList = function(item) {
      localStorage.setItem('friend-halle', item);
  }

  this.removeFriendList = function(item) {
      localStorage.removeItem('friend-halle');
  }

  this.getFriendList = function() {
      friendList = localStorage.getItem('friend-halle');
      return friendList;
  }
}
