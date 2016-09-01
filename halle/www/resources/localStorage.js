function getLocalStorage() {
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
}
