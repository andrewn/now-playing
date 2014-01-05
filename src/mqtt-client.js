module.exports = function (pubsub, opts) {
  function log(/* messages */) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log.apply(console, ['mqtt-client'].concat(args));
  }

  var RECONNECT_INTERVAL_FAST = 2000,
      RECONNECT_INTERVAL_SLOW = 10000;

  var url   = 'ws://test.mosquitto.org/mqtt',
      topic = 'bbc/nowplaying/#',
      mosq  = new Mosquitto(),
      channel = pubsub,
      opts  = opts || {},
      autoreconnect = opts.autoreconnect || false,
      currentReconnectTries = 0,
      maxReconnectTries = 5,
      reconnectInterval = RECONNECT_INTERVAL_SLOW,
      reconnectTimerId;

  log('autoreconnect', autoreconnect);

  function connect() {
    log('connecting');
    mosq.connect(url);
    mosq.subscribe(topic, 0);
  }

  connect();

  mosq.onconnect = function(rc){
    log('connected', reconnectTimerId);
    currentReconnectTries = 0;
    window.clearTimeout(reconnectTimerId);
  };

  mosq.ondisconnect = function(rc){
    log('disconnected');
    if (currentReconnectTries >= maxReconnectTries) {
      log('tried 5 times, continuing to try');
    }

    if (autoreconnect) {
      reconnectTimerId = window.setTimeout(connect, reconnectInterval);
      currentReconnectTries++;
    }
  };

  mosq.onmessage = function(topic, payload, qos){
    log('msg', topic, payload, typeof payload);
    pubsub.publish('mqtt.message', { topic: topic, payload: payload });
  };

};