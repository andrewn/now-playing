var postal    = require('postal'),
    client    = require('./mqtt-client'),
    parser    = require('./mqtt-track-parser'),
    trackView = require('./ui/track');

console.log('app');

var pubsub = postal().channel();

client(pubsub);
parser(pubsub);
trackView(pubsub, '#track');

pubsub.subscribe('*.*', function (data, channel) {
  console.log('pubsub', channel.topic, data)
});