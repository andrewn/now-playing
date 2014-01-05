var Mustache = require('mustache'),
    log      = require('../util/logging').createLogger('track-view');

module.exports = function (pubsub, container, config) {
  var $container = document.querySelector(container),
      colorThief = new ColorThief(),
      imageUrl   = config.imageUrlTmpl || '';

  function template() {
    return   '{{#image}}'
           +    '<img class="image" src="' + imageUrl + '/images/ic/1248xn/{{ image }}" />'
           + '{{/image}}'
           + '<h2 class="title">{{ title }}</h2>'
           + '<p class="artist">{{ artist }}</p>';
  }

  function view(track) {
    return {
      title  : track.get('title'),
      artist : track.get('artist'),
      image  : track.get('image')
    };
  }

  function render(track) {
    return Mustache.render(template(), view(track));
  }

  function smallImageUrl(imagePid) {
    // return Mustache.render('http://ichef.bbci.co.uk/images/ic/304xn/{{ imagePid }}', {imagePid: imagePid});
    return Mustache.render( imageUrl + 'images/ic/304xn/{{ imagePid }}', {imagePid: imagePid});
  }

  function imageFromUrl(url) {
    var image = new Image();
    image.onload = function () {
      log('image loaded', image);
      log(colourForImage(image));
    }
    image.src = url;
    return image;
  }

  function colourForImage(image) {
    log(image);
    return colorThief.getColor(image);
  }

  function smallImage(imagePid) {
    return imageFromUrl( smallImageUrl(imagePid) );
  }

  function contrastHex(hexcolor) {
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    return contrastRgb([r, g, b]);
  }

  /*
    Returns black or white
  */
  function contrastRgb(rgb){
    var BLACK = [0,0,0],
        WHITE = [255,255,255];

    var r = rgb[0],
        g = rgb[1],
        b = rgb[2];
        
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? BLACK : WHITE;
  }

  function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  function randColRgb() {
    return [
      randomFromInterval(0, 255),
      randomFromInterval(0, 255),
      randomFromInterval(0, 255)
    ];
  }

  function cssText(rgb) {
    log('cssText', rgb);
    return 'rgb(' + rgb.join(',') + ')';
  }

  function setColoursForImage(image) {
    var col = colourForImage(image);
    var contrast = contrastRgb(col);
    log('colour %o contrast %o', col, contrast);
    $container.style.color = cssText(contrast);
  }

  function createImageColoursCallback(image) {
    return function () {
      setColoursForImage(image);
    };
  }

  function update(track) {
    $container.innerHTML = render(track);

    var image = $container.querySelector('img');
    if (image && image.complete) {
      log('image already loaded');
      setColoursForImage(image);
    } else if (image) {
      log('waiting for image to load')
      image.onload = createImageColoursCallback(image);
    } else {
      // TODO: use artist/title/record id to generate background color?
      // Change text to random background colour
      log('no image');
      var col = randColRgb();
      var contrast = contrastRgb(col);
      log('col, contrast', col, contrast);
      document.body.style.backgroundColor = cssText(col);
      $container.style.color = cssText(contrast);
    }
  }

  pubsub.subscribe('station.playing', update);
}