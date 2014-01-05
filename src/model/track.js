var Track = function (attr) {
  this.attributes = attr;
};

Track.create = function (json) {
  return new Track(json);
};

Track.prototype = {
  /*
    image
    Returns the first contributor image_pid 
    `p01g3wpc.jpg` component, or null if nothing 
    found
  */
  image: function () {
    var contributions = this.get('contributions');
    if (contributions && contributions.length > 0) {
      return contributions[0].image_pid;
    } else {
      return null;
    }
  },
  /*
    get
    Fetch a value from the track. If a method
    is available on the track object, it will
    be called and its value returned, otherwise
    it will be returned directly from the `attributes`
    object
  */
  get: function (key) {
    if (this[key] && typeof this[key] == 'function') {
      return this[key]();
    } else if (this[key]) {
      return this[key];
    } else {
      return this.attributes[key];
    }
  }
};

module.exports = Track;