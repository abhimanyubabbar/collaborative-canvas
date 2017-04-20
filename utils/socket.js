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
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'sockets'});

function socketHook(http) {

  var io = require('socket.io')(http);

  io.on('connection', (socket) => {

    socket.on('object:added', (data)=> {

      const room = socket.room;

      if (room == null) {
        log.warning({'socket-id': socket.id}, `Socket connection has no room configured`);
        return;
      }

      storage.addEvent(room, data);
      socket.to(room).emit('object:added', data);
    });

    
    socket.on('object:modified', (data)=> {

      const room = socket.room;

      if (room == null) {
        log.warning({'socket-id': socket.id}, `Socket connection has no room configured`);
        return;
      }

      storage.updateEvent(room, data);
      socket.to(room).emit('object:modified', data);
    });

    /**
     * `join` event gets fired at the client
     * side when they join a canvas to work on
     * collboratively. This is done to prevent
     * sending the events to all the connected clients.
     * It introduces multiplexing.
     **/
    socket.on('join', (data)=>{

      var from = data.from;
      var to = data.to;

      if (from == null) {
        from = socket.id;
      }

      socket.room = to;

      socket.leave(from);

      log.info({'from-room': from, 'to-room': to}, `Migrated the socket to join conversation of other room`);
      socket.join(to);
    });

  });
}

module.exports = socketHook;
