const app = require('express')()
var server = require('http').createServer(app);
const fs = require('fs');
const Jimp = require('jimp');

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
  socket.on('request', data => { //data: user가 보낸 json 파일
    io.emit('sendRequest', data);
    console.log('sendRequest');
  });
  socket.on('sendFeedback', data => { // data: desinger가 보낸 json 파일
    // fs.writeFile('./get.json', JSON.stringify(data), (err) => {
    //   if (err) throw err;
    // });
    // console.log('requested json saved');
    io.emit('requestedFeedback', data);
    console.log('requestedFeedback');
  });
  socket.on('sendDataURL', data => {
    io.emit('sendDataURL', data);
    console.log('sendDataURL');
  });
})
