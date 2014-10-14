'use strict';

angular.module('genie')
    .factory('genesysLocationService', function($resource, $http, $log) {

    	var GenesysLocationService = function() {

    		var officeLocations = {
				"Argentina": ["Buenos Aires"],	
				"Australia": ["Brisbane", "Canberra", "Melbourne", "North Sydney"],
				"Belgium": ["Zaventem"],
				"Brazil": ["Sao Paulo"],
				"Canada": ["Toronto", "Markham", "Saint John", "Alberta", "British Columbia", "New Brunswick", "Newfoundland", "Nova Scotia", "Ontario", "Quebec", "Saskatchewan"],
				"Chile": ["Chile"],
				"China": ["Beijing", "Hangzhou"],
				"Colombia": ["Bogota"],
				"Costa Rica": ["Costa Rica"],
				"Czech Republic": ["Prague", "Czech Republic"],
				"Dominican Republic": ["Dominican Republic"],
				"Finland": ["Finland"],
				"France": ["Brest", "Paris"],
				"Germany":	["Darmstadt", "Dortmund", "Munich"],
				"Greece": ["Greece"],
				"Hong Kong": ["Hong Kong"],
				"Hungary": ["Hungary"],
				"India": ["Bangalore", "Chennai", "Gurgaon", "Mumbai"],
				"Israel": ["Tel Aviv"],
				"Italy": ["Rome", "Vimercate", "Italy"],
				"Japan": ["Tokyo"],
				"Korea": ["Seoul"],
				"Latvia": ["Latvia"],
				"Luxembourg": ["Luxemburg"],
				"Malaysia":	["Kuala Lumpur"],
				"Mexico": ["Mexico City"],
				"Netherlands": ["Naarden"],
				"New Zealand": ["Wellington"],
				"Peru":	["Peru"],
				"Poland": ["Bydgoszcz", "Warsaw"],
				"Romania": ["Romania"],
				"Russia": ["St. Petersburg"],
				"Singapore": ["Singapore"],
				"Slovakia": ["Slovakia"],
				"South Africa":	["South Africa"],
				"Spain": ["Madrid"],
				"Sweden": ["Stockholm"],
				"Switzerland": ["Zurich"],
				"Taiwan": ["Taiwan"],
				"Thailand":	["Bangkok"],
				"Turkey": ["Istanbul"],
				"Ukraine":	["Kiev"],
				"United Arab Emirates": ["United Arab Emirates"],
				"United Kingdom": ["Frimley"],
				"United States": ["Alpharetta", "Arlington", "Bedford", "Boston", "Bozeman", "Chantilly", "Dallas", "Daly City", "Irvine", "Miami", "Morrisville", "Pleasanton", "Rosemont", "Salt Lake City", "Vienna", 
					"Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
					"Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
					"New Jersey", "New York", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "South Carolina", "South Dakota", "Tennessee",
					"Texas", "Utah", "Virginia", "Washington", "Wisconsin"],
				"Venezuela": ["Venezuela"]
			};

			this.IMAGE_TYPE = {
				ME: "me", 
				CARD: "card"
			};

			this.IMAGE_TIME = {
				DAY: "Day", 
				NIGHT: "Night"
			};

			this.getImageByLocation = function(type, time, country, city) {
				$log.info("Getting image  - " + city + " in "+ country);

				var image = "../../images/locations/others/other_locations_Day.png";

				if (country && city) {
					image = "../../images/locations/" + type + "/" + country + "/" + city + "_" + time + ".png";
				}

				return image;
			};

		};

		return new GenesysLocationService();
	});