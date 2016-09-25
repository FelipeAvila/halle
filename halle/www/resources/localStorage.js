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
      localStorage.setItem('friend-halle', JSON.stringify(item));
  }

  this.removeFriendList = function(item) {
      localStorage.removeItem('friend-halle');
  }

  this.getFriendList = function() {
      friendList = localStorage.getItem('friend-halle');
      return JSON.parse(friendList);
  }

  /**** localStorage lista de amigos ****/

  var contactList = "";

  this.saveContactList = function(item) {
      localStorage.setItem('contact-halle', JSON.stringify(item));
  }

  this.removeContactList = function(item) {
      localStorage.removeItem('contact-halle');
  }

  this.getContactList = function() {
      contactList = localStorage.getItem('contact-halle');
      return JSON.parse(contactList);
  }

}
