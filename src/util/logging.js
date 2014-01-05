module.exports = {
  createLogger: function (name) {
    return function log(/* messages */) {
      var args = Array.prototype.slice.call(arguments, 0);
      console.log.apply(console, [name].concat(args));
    };
  }
};