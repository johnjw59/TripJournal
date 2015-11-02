angular.module('service.geolocation', ['ngGPlaces'])
.config(function(ngGPlacesAPIProvider){
  ngGPlacesAPIProvider.setDefaults({
    radius: 100,
    types: []
  });
})
.service("GeolocationService", function ($cordovaGeolocation, $q, $ionicPopup, ngGPlacesAPI) {
	var self = {
		lat: 0,
		lon: 0,
		loc: function() {
      var defer = $q.defer();

			$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
			.then(function(pos) {
				self.lat = pos.coords.latitude;
				self.lon = pos.coords.longitude;

        defer.resolve(pos);
			}, function(err) {
				console.error(err);
				$ionicPopup.alert({
					'title': 'Please switch on geolocation',
					'template': "It seems like you've switched off geolocation for TripJournal, please switch it on by going to you application settings."
				});

        defer.reject(err);
			});

      return defer.promise;
		},
    
    places: function() {
      var defer = $q.defer();

      self.loc().then(function(loc) {
        ngGPlacesAPI.nearbySearch({latitude: loc.coords.latitude, longitude: loc.coords.longitude})
        .then(function(data) {
          data.loc = {
            lat: loc.coords.latitude,
            lon: loc.coords.longitude
          };
          defer.resolve(data);
        }, function(err) {
          defer.reject(err);
        });
      }, function(err) {
        console.error(err);
      });

      return defer.promise;
    },
    watch: null,
    unwatch: null
	};

  self.loc();
	return self;
});
