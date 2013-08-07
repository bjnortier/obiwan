'use strict';

var _ = require('underscore');

var DB = function(options) {

  var eventSourceMap = options.map;
  var eventSourceReduce = options.reduce;
  var events = [];

  this.push = function(event, callback) {
    events.push(event);
    callback(null);
  };

  this.getObj = function(key, callback) {

    var mappedEvents = _.reduce(events, function(acc, event) {
      var key = eventSourceMap(event);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {});

    var reducedEvents = _.reduce(mappedEvents, function(acc, events, key) {
      acc[key] = eventSourceReduce(key, events);
      return acc;
    }, {});

    callback(null, reducedEvents[key]);
  };


};

module.exports.DB = DB;