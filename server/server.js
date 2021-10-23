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
var count = 0
io.on('connection', socket =>{
  console.log("New client connected");
  socket.on('request', data => { //data: user가 보낸 json 파일
    fs.writeFile(`./request-${count}.json`, JSON.stringify(data), err => {
      if (err) throw err;
    });
    io.emit('sendRequest', data);
    console.log('sendRequest');
  });
  socket.on('sendFeedback', data => { // data: desinger가 보낸 json 파일
    fs.writeFile(`./feedback-${count}.json`, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    io.emit('requestedFeedback', data);
    console.log('requestedFeedback');
  });
  socket.on('sendAssessment', data => { // data: desinger가 user한테 보낸 점수와 피드백
    fs.writeFile(`./score-${count}.json`, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    count ++;
    io.emit('getAssessment', data);
    console.log('getAssessment');
  });
  socket.on('sendDataURL', data => {
    io.emit('sendDataURL', data);
    console.log('sendDataURL');
  });
})
