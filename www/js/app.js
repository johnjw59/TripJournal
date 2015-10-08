// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var example = angular.module('starter', ['ionic']);

example.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    Parse.initialize("MY4KyWo5RUK2yX6GIFEambS54Mv8X4EXm7PIoSBs","qFqeFSzjVHxEpOKYWKjuOHYs42PhkzWWwVSEhaqE");
  });
});

example.controller("ExampleController", function($scope) {
 
    $scope.savePerson = function(firstname, lastname) {
        var PeopleObject = Parse.Object.extend("PeopleObject");
        var person = new PeopleObject();
        person.set("firstname", firstname);
        person.set("lastname", lastname);
        person.save(null, {});
    }

    $scope.getPeople = function(params) {
        var PeopleObject = Parse.Object.extend("PeopleObject");
        var query = new Parse.Query(PeopleObject);
        if(params !== undefined) {
            if(params.lastname !== undefined) {
                query.equalTo("lastname", params.lastname);
            }
            if(params.firstname !== undefined) {
                query.equalTo("firstname", params.lastname);
            }
        }
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " people!");
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get("firstname") + " " + object.get("lastname"));
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
  });
