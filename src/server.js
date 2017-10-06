const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const circleobjs = {};


let playersinRoom = 0;
let Roomnumber = 0;

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (request, response) => {
  console.log(request.url);
  if (request.url === '/') {
    fs.readFile(`${__dirname}/../hosted/client.html`, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(data);
    });
  } else if (request.url === '/bundle.js') {
    fs.readFile(`${__dirname}/../hosted/bundle.js`, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'application/javascript' });
      response.end(data);
    });
  }
};

const app = http.createServer(handler);

app.listen(port);

const io = socketio(app);


io.on('connection', (socket) => {
  const R = Math.floor(Math.random() * 256);
  const G = Math.floor(Math.random() * 256);
  const B = Math.floor(Math.random() * 256);
  const newroom = [];
  if (playersinRoom === 0) {
    for (let y = 0; y < 5; y++) {
      newroom[y] = [];
    }
    for (let x = 0; x < 5; x++) {
      for (let k = 0; k < 5; k++) {
        newroom[x][k] = null;
      }
    }
    circleobjs[Roomnumber] = newroom;
  }
  playersinRoom += 1;

  socket.join(`room ${Roomnumber}`);

  socket.emit('Joined', { R, G, B, circleobjs: circleobjs[Roomnumber], Roomnumber });

  if (playersinRoom === 2) {
    Roomnumber += 1;
    playersinRoom = 0;
  }


  console.log('user has joined a room');


  socket.on('updateCanvas', (data) => {
    console.log('recieved circle');

    let x = (data.circle.x - 50) / 100;
    let y = (data.circle.y - 50) / 100;

    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    const array = circleobjs[data.roomNumber];
    if (array[x][y] === null) {
      array[x][y] = data;
    }

    io.in(`room ${data.roomNumber}`).emit('UpdatefromServer', (data));
    console.log('broadcasting circle');
  });


  socket.on('disconnect', () => {
    // socket.leave('room1');
    console.log('user left the room');
  });
});

console.log(`Listening on localhost on ${port}`);
