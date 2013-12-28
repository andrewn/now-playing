module.exports = function (pubsub) {

  var Track = require('./model/track');

  function log(/* messages */) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['mqtt-track-parser'].concat(args));
  }

  function stationIdFrom(topic) {
    var matcher = new RegExp('bbc/nowplaying/(.*)'),
        matches = topic.match(matcher);

    return (matches && matches.length > 1) ? matches[1] : null;
  }

  function parse(data) {
    var topic   = data.topic,
        payload = data.payload,
        json;
    
    if (payload) {
      json = JSON.parse(payload);
      json.stationId = stationIdFrom(topic);
    }

    if (json) {
      pubsub.publish('track.new', Track.create(json));
    }
  }

  pubsub.subscribe('mqtt.message', parse);
};