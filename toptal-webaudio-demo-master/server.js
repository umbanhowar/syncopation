////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/app'));
app.use('/article', express.static(__dirname + '/article'));

server.listen(process.env.PORT || 3000);

var clients = [];

io.on('connection', function(socket){
  console.log('a user connected');

  var client_id = Math.floor(Math.random() * 100000);
  clients.push({'socket':socket, 'id':client_id});
  socket.broadcast.emit("new-connection", {"id":client_id});

  socket.on('note-on', function(object){
    console.log(object);
    socket.broadcast.emit("note-on", object);
  });
  socket.on('note-off', function(object){
    console.log(object);
    socket.broadcast.emit("note-off", object);
  });
  socket.on('detune', function(object){
    console.log(object);
    socket.broadcast.emit("detune", object);
  });

  socket.on('disconnect', function(socket){
    console.log('user disconnected');
    var newClients = [];
    clients.forEach(function (client) {
      if (client.socket == socket) {
        socket.broadcast.emit("user-disconnect", {"id":client.id});
      } else {
        newClients.push(client);
      }
    });
    clients = newClients;
  });
});
