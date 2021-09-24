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

function GetGap(json) {
  const childrenList = json.pages[0].children;
  const componentGap = [];

  // Step1. 각 component의 중심점 찾아내기
  const centerPoints = [];
  for (i in childrenList) {
    // get numeric data from json file ([x,y]의 범위: [1,1] ~ [1080, 1080])
    const x = childrenList[i].x;
    const y = childrenList[i].y;
    const rot = childrenList[i].rotation;
    const w = childrenList[i].width;
    const h = childrenList[i].height;
    
    const centerPoint = [];
    // calculate the movement
    const a = (Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2))/2)*Math.cos(rot + Math.atan2(h, w));
    const b = (Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2))/2)*Math.sin(rot + Math.atan2(h, w));
    // calculate the center point and push it into array
    centerPoint.push(x + a);
    centerPoint.push(y + b);
    centerPoints.push(centerPoint); 
  }
  
  // Step2. 중심점끼리의 거리 찾아내기
  for (let x=0; x < centerPoints.length-1; x++) {
    const center1 = centerPoints[x];
    const center2 = centerPoints[x+1];
    const diff = Math.sqrt(Math.pow(center1[0]-center2[0], 2) + Math.pow(center1[1]-center2[1], 2)).toFixed(0);
    componentGap.push(diff);
  }
  return componentGap;

  // Step3. 기존의 선택된 데이터의 값이랑 비교하기? OR 균일한지 아닌지 확인하기
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

function CalAlignment() {
  const json = JSON.parse(fs.readFileSync('./send.json'));
  const childrenList = json.pages[0].children;
  // Step1. text element를 모두 가져오기 -> text element만 확인하는 이유: svg element는 나중에 negative space나 symmetry에서 확인할 수 있을 듯
  // Step2. 가져온 text element의 좌,우,가운데 정렬 확인
  // Step3. 좌, 우, 가운데 정렬의 시작 위치 확인, 90도 돌렸는지 확인

}

io.on('connection', socket =>{
  console.log("New client connected");
  socket.on('change', data => {
    const angleResult = CalAngleLevel(data);
    const textResult = CalTextSize(data);
    const componentGap = GetGap(data);
    const result = {
      angleResult: angleResult,
      textResult: textResult,
      componentGap: componentGap
    };
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
