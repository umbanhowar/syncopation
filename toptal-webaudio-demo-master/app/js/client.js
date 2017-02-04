document.addEventListener("DOMContentLoaded", function(event) {
  //do work
  var socket = io();

  var otherClients = [];

  var removeClientById = function(id) {
    var newClients = [];
    otherClients.forEach(function (client) {
      if (client.id != id) {
        newClients.push(client);
      }
    });
    otherClients = newClients;
  };

  var changeClientSynthById = function(id) {
    var newClients = [];
    otherClients.forEach(function (client) {
      if (client.id != id) {
        newClients.push(client);
      }
    });
    otherClients = newClients;
  };


 
  socket.on('new-connection', function (object) {
    // a new client has joined! 
    var newSynth = null; //make a new synth!!!
    var newClient = {"id":object.id, "synth":newSynth}; 
    otherClients.push(newClient);
    console.log(object);
  });
  socket.on('user-disconnect', function (object) {
    removeClientById(object.id);
    console.log(object);
  });
  socket.on('synth-change', function (object) {
    
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
  socket.on('client-id', function (object) {
    clientId = object.id;
  });
});
