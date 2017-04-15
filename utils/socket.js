'use strict';

// socketHook handles the data 
// transmitted over the socket to the server
// from the client.
function socketHook(http) {

  var io = require('socket.io')(http);

  io.on('connection', (socket) => {

    // Forward the path created event to
    // all the listeners.
    socket.on('path:created', (data)=> {

      socket.broadcast.emit('path:created', data);
    });

  });
}

module.exports = socketHook;
