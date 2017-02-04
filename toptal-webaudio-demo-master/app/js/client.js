document.addEventListener("DOMContentLoaded", function(event) {
  //do work
  var socket = io();

  socket.on('new-connection', function (object) {
    console.log(object);
  });
  socket.on('user-disconnect', function (object) {
    console.log(object);
  });
  socket.on('note-on', function (object) {
    console.log(object);
  });
  socket.on('note-off', function (object) {
    console.log(object);
  });
  socket.on('detune', function (object) {
    console.log(object);
  });
});
