'use strict';

var async = require('async');
var chai = require('chai');
var assert = chai.assert;
chai.Assertion.includeStack = true;

var obiwan = require('../..');

describe('The API', function() {

  it('can reconstruct objects from events', function(done) {

    var map = function(event) {
      return event.token;
    };

    var reduce = function(key, events) {
      var obj = {token: key, bars: []};
      events.forEach(function(event) {
        if (event.type === 'create') {
          obj.created = event.timestamp;
        }
        if (event.type === 'bar') {
          obj.bars.push(event.value);
        }
      });
      return obj;
    };

    var db = new obiwan.DB({map: map, reduce: reduce});

    var events = [
      {type: 'create', token: 'bfc3', timestamp: 0},
      {type: 'bar', token: 'bfc3', timestamp: 1, value: 'x'},
      {type: 'bar', token: 'bfc3', timestamp: 2, value: 'y'},
    ];

    async.parallel(events.map(function(event) {
      return function(cb) { db.push(event, cb); };
    }), function(err) {
      assert.isNull(err);

      db.getObj('bfc3', function(err, obj) {
        assert.isNull(err);
        assert.deepEqual(obj, {
          created: 0,
          token: 'bfc3', 
          bars: ['x', 'y'],
        });
        done();
      });

    });

  });

});