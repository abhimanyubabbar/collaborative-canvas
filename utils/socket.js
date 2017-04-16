/**
 * The socket module handles the socket communication
 * with the clients of the system. It:
 *
 * 1. Mainly captures the events originating at the client regarding
 * the changes made to the canvas.
 *
 * 2. It stores the events using storage layer and then
 * propogates the events to the other connected clients in the system.
 *
 **/


'use strict';

var storage = require('./storage');

function socketHook(http) {

  var io = require('socket.io')(http);

  io.on('connection', (socket) => {

    // Forward the path created event to
    // all the listeners.
    socket.on('path:created', (data)=> {

      const room = socket.room;

      if (room == null) {
        console.log(`Socket connection on no room: ${socket.id}`);
        return;
      }

      storage.addEvent(room, data);
      socket.to(room).emit('path:created', data);

    });

    /**
     * `join` event gets fired at the client
     * side when they join a canvas to work on
     * collboratively. This is done to prevent
     * sending the events to all the connected clients.
     * It introduces multiplexing.
     **/
    socket.on('join', (data)=>{

      if (data.from != null) {
        socket.leave(data.from);
      }

      socket.room = data.to;
      socket.join(data.to);
    });

  });
}

module.exports = socketHook;
