angular.module('service.geolocation', ['ngGPlaces'])
.config(function(ngGPlacesAPIProvider){
  ngGPlacesAPIProvider.setDefaults({
    radius:100
  });
})
.service("GeolocationService", function ($cordovaGeolocation, $ionicPopup, ngGPlacesAPI) {
	var self = {
		'lat': 0,
		'lon': 0,
		'places': null,
		'fetch': function () {

			ionic.Platform.ready(function () {
				$cordovaGeolocation
					.getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
					.then(function (position) {
						self.lat = position.coords.latitude;
						self.lon = position.coords.longitude;

						ngGPlacesAPI.nearbySearch({latitude:position.coords.latitude, longitude:position.coords.longitude})
						.then(function(data){
        			self.places = data;
      			}, function (err) {
      				console.log(err);
      			});
						
					}, function (err) {
						console.error("Error getting position");
						console.error(err);
						$ionicPopup.alert({
							'title': 'Please switch on geolocation',
							'template': "It seems like you've switched off geolocation for TripJournal, please switch it on by going to you application settings."
						});
					})
			});
		}
	};

	self.fetch();
	return self;
});