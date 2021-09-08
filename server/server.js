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
  socket.on('save', data => {
    fs.writeFile('./src/polotno.json', data, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
    console.log('Successfully Download');
    io.emit('toBack', data);
    console.log('emit the saved json to client')
  });
})