module.exports = function (pubsub, container) {
  var $container = document.querySelector(container);

  function render(track) {
    return '<h2>' + track.get('title')  + '</h2>' +
           '<p>'  + track.get('artist') + '</p>';
  }

  pubsub.subscribe('track.new', function (track) {
    $container.innerHTML = render(track);
  });
}