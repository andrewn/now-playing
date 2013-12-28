module.exports = function (pubsub) {
  function log(/* messages */) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['mqtt-client'].concat(args));
  }

  function publish(topic, payload) {

  }

  var url   = 'ws://test.mosquitto.org/mqtt',
      topic = 'bbc/nowplaying/#',
      mosq  = new Mosquitto(),
      channel = pubsub;

  log(pubsub)

  mosq.connect(url);

  mosq.subscribe(topic, 0);

  mosq.onconnect = function(rc){
    log('connected');
  };

  mosq.ondisconnect = function(rc){
    log('disconnected');
  };

  mosq.onmessage = function(topic, payload, qos){
    log('msg', topic, payload, typeof payload);
    pubsub.publish('mqtt.message', { topic: topic, payload: payload });
  };

};