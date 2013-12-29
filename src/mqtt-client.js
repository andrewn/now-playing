module.exports = function (pubsub, opts) {
  function log(/* messages */) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['mqtt-client'].concat(args));
  }

  var url   = 'ws://test.mosquitto.org/mqtt',
      topic = 'bbc/nowplaying/#',
      mosq  = new Mosquitto(),
      channel = pubsub,
      opts  = opts || {},
      autoreconnect = opts.autoreconnect || false,
      reconnectTimerId;

  log('autoreconnect', autoreconnect);

  function connect() {
    log('connecting');
    mosq.connect(url);
  }

  connect();
  mosq.subscribe(topic, 0);

  mosq.onconnect = function(rc){
    log('connected');
    window.clearInterval(reconnectTimerId);
  };

  mosq.ondisconnect = function(rc){
    log('disconnected');
    if (autoreconnect) {
      reconnectTimerId = window.setInterval(connect, 2000);
    }
  };

  mosq.onmessage = function(topic, payload, qos){
    log('msg', topic, payload, typeof payload);
    pubsub.publish('mqtt.message', { topic: topic, payload: payload });
  };

};