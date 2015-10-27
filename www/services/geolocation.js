var app = angular.module('service.geolocation', []);

app.service("GeolocationService", function ($q, $cordovaGeolocation, $ionicPopup) {
	var self = {
		'lat': 0,
		'lon': 0,
		'fetch': function () {
			// var deferred = $q.defer();

			ionic.Platform.ready(function () {
				$cordovaGeolocation
					.getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
					.then(function (position) {
						self.lat = position.coords.latitude;
						self.lon = position.coords.longitude;
						// deferred.resolve();
					}, function (err) {
						console.error("Error getting position");
						console.error(err);
						$ionicPopup.alert({
							'title': 'Please switch on geolocation',
							'template': "It seems like you've switched off geolocation for TripJournal, please switch it on by going to you application settings."
						});
					})
			});

			// return deferred.promise;
		}
	};

	self.fetch();
	return self;
});