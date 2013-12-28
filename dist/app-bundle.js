(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var client = require('./mqtt-client');
},{"./mqtt-client":2}],2:[function(require,module,exports){
exports = function () {
  function log(/* messages */) {
    console.log.apply(console, arguments);
  }

  function publish(topic, payload) {

  }

  var url   = 'ws://test.mosquitto.org/mqtt',
      topic = 'bbc/nowplaying/#',
      mosq  = new Mosquitto(),
      channel = new postal.channel();

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

  };

};
},{}]},{},[1])