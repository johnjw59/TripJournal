var Parse = {
  initialize: function() {
    return true;
  },
  User: {
    current: function() { 
      return {
        getUsername: function() { 
          return 'username'; 
        },
        id: '1234'
      };
    }
  },
  Object: {
    extend: function() {
      return function() {
        this.set = function() {
          return true;
        };
        this.save = function(arg, callbacks) {
          callbacks.success({id: '1234'});
        };
      };
    }
  },
  Query: function() {
    return {
      equalTo: function() { return this; },
      descending: function() { return this; },
      exists: function() {return this; },
      find: function(callbacks) {
        callbacks.success([{attributes: {id: '1234'}}]);
      }
    };
  }
};
