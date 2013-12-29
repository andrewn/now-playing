module.exports = function (pubsub) {
  var currentStation;

  pubsub.subscribe('track.new', function (track) {
    if (track.get('stationId') === currentStation) {
      pubsub.publish('station.playing', track);
    }
  });

  return {
    station: function (id) {
      currentStation = id;
    }
  };

};