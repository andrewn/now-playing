var postal    = require('postal'),
    client    = require('./mqtt-client'),
    parser    = require('./mqtt-track-parser'),
    trackView = require('./ui/track'),
    currentTrack = require('./station'),
    appConfig = require('../config/app');

console.log('app');

var pubsub = postal().channel();

var stationId = Arg('station') || 'radio1';

console.log('current station', stationId);

currentTrack(pubsub).station(stationId);
parser(pubsub);
trackView(pubsub, '#track', appConfig);

// Instantiate the MQTT client last since 
// we should get messages on connection
client(pubsub, { autoreconnect: true });

pubsub.subscribe('*.*', function (data, channel) {
  console.log('pubsub', channel.topic, data)
});