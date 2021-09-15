const app = require('express')()
var server = require('http').createServer(app);
var cors = require('cors');
const fs = require('fs');

const port = process.env.PORT || 3002;

server.listen(port, function(){
  console.log(`listening on port ${port}`);
})

var io = require('socket.io')(server,{
  cors:{
    origin :"*",
    credentials: true
  }
})

io.on('connection', socket =>{
  console.log("New client connected");
  socket.on('requestJson', data => {
    io.emit('requestJson', data);
    console.log('requestJson');
  });
  socket.on('requestedJson', data => {
    fs.writeFile('./get.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    io.emit('requestedJson', data);
    console.log('requestedJson');
  });
  socket.on('sendJson', data => {
    fs.writeFile('./send.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    io.emit('sendJson', data);
    console.log('sendJson');
  });
  socket.on('sendDataURL', data => {
    io.emit('sendDataURL', data);
    console.log('sendDataURL');
  });
})