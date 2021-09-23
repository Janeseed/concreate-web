const app = require('express')()
var server = require('http').createServer(app);
var cors = require('cors');
const fs = require('fs');
const math = require('mathjs');

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


//json 파일 형식에서 일단 계산하는 것 만들기
function CalTextSize (json) {

  const childrenList = json.pages[0].children;

  const textSizes = [];

  for (let x in childrenList) {
    if (childrenList[x].type == "text") {
      textSizes.push(childrenList[x].fontSize);
    };
  };

  textSizes.sort(function(a,b){return a-b});

  const minText = textSizes[0];
  const maxText = textSizes[textSizes.length-1];

  return [minText, maxText];
}

function GetGap() {
  const componentGap = [];
  //각 component의 중심점 찾아내기
  //중심점끼리의 거리 찾아내기
}

function CalAngleLevel(json) {
  const angles = [];
  const differences = [];
  const childrenList = json.pages[0].children;

  for (let x in childrenList) {
    const angle = childrenList[x].rotation;
    angles.push(angle);
  }

  const average = arr => arr.reduce((a,b) => a+b, 0) / arr.length;
  angles.sort(function(a,b){return a-b}); //sorting numbers in ascending orders
  
  for (let x =0; x < angles.length-1; x++) {
    if ( angles[x] != angles[x+1]) {
      const diff = angles[x+1]-angles[x];
      differences.push(diff).toFixed(2);
    }
  }
  
  if ( differences.length > 2) {
    //if there are more than 3 types of angles, show raw angles
    const message = 'Angles are diverse';
    return [message, angles]
  } else {
    //if there are less than 2 types of angles, show average of angles
    const message = 'Angles are similar';
    return [message, average(angles).toFixed(2)]
  }
}

io.on('connection', socket =>{
  console.log("New client connected");
  socket.on('change', data => {
    const angleResult = CalAngleLevel(data);
    const textResult = CalTextSize(data);
    const result = {angleResult: angleResult, textResult: textResult};
    io.emit('show', result);
  });
  socket.on('requestJson', data => {
    io.emit('requestJson', data);
    console.log('requestJson');
  });
  socket.on('requestedJson', data => {
    fs.writeFile('./get.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    console.log('requested json saved');
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
