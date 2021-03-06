
angular.module('services', [])

.service('dataService', ['$http', '$q',function($http, $q) {
  this.eventsURL = 'http://eveapp.top/api/v1/events.js';
  this.eventDetailURL = 'http://eveapp.top/api/v1/event/$id.js';

  this.eventList = {};
  this.getEventList = function() {
    var service = this;
    var deferred = $q.defer();
    var ts = new Date().getHours();

    this.currentEventDetail = {}

    // Try to load from API
    $http.get(this.eventsURL + "?timestamp=" +ts)
      .success(function (json) {
        service.saveEventList(json);
        deferred.resolve(json);
      })
      .error(function (error) {
        var data = service.loadEventList();
        deferred.resolve(data);
      });

    return deferred.promise;
  }

  this.saveEventList = function(eventList) {
    window.localStorage['eventList'] = JSON.stringify(eventList);
  }

  this.loadEventList = function() {
    return JSON.parse(window.localStorage['eventList'] || '{}');
  }

  this.saveEventDetail = function(event) {
    window.localStorage[event.id] = JSON.stringify(event);
  }

  this.loadEventDetail = function(event) {
    return JSON.parse(window.localStorage[event.id] || '{}');
  }

  this.getEventDetail = function(event) {
    var ts = new Date().getHours();

    var service = this;
    var deferred = $q.defer();

    var url = this.eventDetailURL.replace('$id', event.id);

    // Try to load from API
    $http.get(url + "?timestamp=" +ts)
      .success(function (json) {
        service.saveEventDetail(json);
        service.currentEventDetail = json;
        deferred.resolve(json);
      })
      .error(function (error) {
        var data = service.loadEventDetail(event);
        service.currentEventDetail = data;
        deferred.resolve(data);
      });

    return deferred.promise;
  }

  this.saveFavourites = function(eventId, favourites) {
    window.localStorage[eventId+"_fav"] = JSON.stringify(favourites);
    console.log(JSON.stringify(favourites));
  }

  this.loadFavourites = function(eventId) {
    return JSON.parse(window.localStorage[eventId+"_fav"] || '{"ids":[],"talks":[]}');

  }


}])


.service('eventsService', [function() {
  this.currentEvent = {};
}])

.service('speakersService', [function() {
  this.speakers = [];
  this.currentTalk = {};
}]);
