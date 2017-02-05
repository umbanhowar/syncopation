document.addEventListener("DOMContentLoaded", function(event) {
  //do work
  mySynth = new Tone.PolySynth(6, Tone.FMSynth).toMaster();
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

  var getClientSynthById = function (id) {
    console.log("in getClientSynthById, logging otherclients");
    console.log(otherClients);
    console.log("target client id: "+id);
    var client_synth = null;
    otherClients.forEach(function (client) {
      console.log("looking at client id " + client.id)
      if (client.id == id) {
        client_synth = client.synth;
      }
    });
    if (client_synth == null) {
      console.log("client not found");
    }
    return client_synth;
  }

  function _midiToFreq(d) {
    var res = Math.pow(2, (d-69)/12.0)*440;
    return res;
  }

  socket.on('client-list', function (object) {
    // set the client list to include the clients already in the room
    object.list.forEach(function (id) {
      var newSynth = new Tone.PolySynth(6, Tone.Synth).toMaster();
      otherClients.push({"id":id, "synth":newSynth});
    });

  });
  socket.on('new-connection', function (object) {
    // a new client has joined!
    var newSynth = new Tone.PolySynth(6, Tone.Synth).toMaster(); //make a new synth!!!
    var newClient = {"id":object.id, "synth":newSynth};
    otherClients.push(newClient);
    console.log(otherClients);
  });
  socket.on('user-disconnect', function (object) {
    removeClientById(object.id);
    console.log(object);
  });
  socket.on('synth-change', function (object) {

    console.log(object);
  });
  socket.on('note-on', function (object) {
    var clientSynth = getClientSynthById(object.id);
    var scaledVelocity = object.velocity/127.0;
    var freq = _midiToFreq(object.note);
    clientSynth.triggerAttack(freq, 0, scaledVelocity);
    console.log(object);
  });
  socket.on('note-off', function (object) {
    var clientSynth = getClientSynthById(object.id);
    clientSynth.triggerRelease(_midiToFreq(object.note));
    console.log(object);
  });
  socket.on('detune', function (object) {
    console.log(object);
  });
  socket.on('client-id', function (object) {
    console.log("my client id is: "+object.id);
    clientId = object.id;
  });
});
