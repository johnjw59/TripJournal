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
      return {
        set: function() {
          return true;
        }
      };
    }
  }
};
