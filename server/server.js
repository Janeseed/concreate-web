const app = require('express')()
var server = require('http').createServer(app);
var cors = require('cors');
const e = require('express');
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
    if (childrenList[x].type === "text") {
      textSizes.push(childrenList[x].fontSize);
    };
  };

  textSizes.sort(function(a,b){return a-b});

  const minText = (textSizes[0]).toFixed(1);
  const maxText = (textSizes[textSizes.length-1]).toFixed(1);

  return {
    minText: minText,
    maxText: maxText,
  };
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
    return {
      message: message,
      averageAngle: average(angles).toFixed(2),
    }
  }
}

function CalAlignment(json) {
  const childrenList = json.pages[0].children;

  const rightAlign = [];
  const centerAlign = [];
  const leftAlign = [];
  const rotAlign = [];

  // Step1. text element를 모두 가져오기 -> text element만 확인하는 이유: svg element는 나중에 negative space나 symmetry에서 확인할 수 있을 듯
  for (i in childrenList) {
    if (childrenList[i].type === 'text') {
      const alignData = {
        alignment: childrenList[i].align,
        x: childrenList[i].x,
        y: childrenList[i].y,
        width: childrenList[i].width,
        rot: childrenList[i].rotation,
        id: childrenList[i].id,
      }
      // Step2. 가져온 text element의 좌,우,가운데 정렬, 90도 돌아갔는지 확인
      if (alignData.rot === 0) {
        if (alignData.alignment === 'center') {
          centerAlign.push(alignData);
        } else if (alignData.alignment === 'right') {
          rightAlign.push(alignData);
        } else if (alignData.alignment === 'left') {
          leftAlign.push(alignData);
        }
      } else {
        rotAlign.push(alignData);
      }
    }
  }

  const numAlign = {
    left: leftAlign.length,
    right: rightAlign.length,
    center: centerAlign.length,
    rotated: rotAlign.length,
  }

  // Step3. main alignment를 찾고 변주가 있는지 확인하기
  let arr = Object.values(numAlign);
  const countZero = arr.filter(x => x==0).length;

  // const yValues = [];
  if (Math.max(...arr) > 2 || countZero >= 3) {
    var mainAlign = Object.keys(numAlign).find(key => numAlign[key] === Math.max(...arr));
    var xValues =[];
    if (mainAlign === 'left') {
      for (i in leftAlign) {
        xValues.push(leftAlign[i].x.toFixed(0));
        // yValues.push(leftAlign[i].y.toFixed(0));
      }
    } else if (mainAlign === 'right') {
      for (i in rightAlign) {
        xValues.push((rightAlign[i].x + rightAlign[i].width).toFixed(0));
        // yValues.push(rightAlign[i].y.toFixed(0));
      }
    } else if (mainAlign === 'center') {
      for (i in centerAlign) {
        xValues.push((centerAlign[i].x + centerAlign[i].width/2).toFixed(0));
        // yValues.push(centerAlign[i].y).toFixed(0);
      }
    }
  } else {
    var mainAlign = 'diverse';

    const leftXValues = [];
    const rightXValues = [];
    const centerXValues = [];
    const rotatedXValues = [];

    for (i in leftAlign) {leftXValues.push(leftAlign[i].x.toFixed(0));}
    for (i in rightAlign) {rightXValues.push((rightAlign[i].x + rightAlign[i].width).toFixed(0));}
    for (i in centerAlign) {centerXValues.push((centerAlign[i].x + centerAlign[i].width/2).toFixed(0));}
    for (i in rotAlign) {rotatedXValues.push(rotAlign[i].x.toFixed(0));}

    var xValues = {
      left: leftXValues,
      right: rightXValues,
      center: centerXValues,
      rotated: rotatedXValues,
    }
  }

  return {
    'Aligning to: ' : mainAlign,
    'Aligning Values' : xValues,
  }
}

function CalNegativeSpace(json) {
  const childrenList = json.pages[0].children;

  // 겹치는지 확인하기 위해 시작점이랑 width, height 구하기, x를 기준으로 정렬하기!
  var childrenData = [];
  for (let i in childrenList) {
    childrenData.push({
      x: childrenList[i].x,
      y: childrenList[i].y,
      width: childrenList[i].width,
      height: childrenList[i].height
    });
  }
  
  var negativeSpace = 1080*1080;
  for (let i in childrenData) {
    // 요소의 값 제외하기
    const childrenSpace = childrenData[i].width*childrenData[i].height;
    negativeSpace -= childrenSpace;
    
    for (let j = 0; j < childrenData.length-1; j++) {
      const x = childrenData[j].x;
      const y = childrenData[j].y;
      const w = childrenData[j].width;
      const h = childrenData[j].height;
      const X = childrenData[i].x;
      const Y = childrenData[i].y;
      const W = childrenData[i].width;
      const H = childrenData[i].height;

      // 만약 겹치는 값이 있으면 겹치는 부분은 다시 더함
      if(i != j) {
        if (w > W) {
          if (x <= X && X <= x+w && y <= Y && Y <= y+h){
            const overlap = math.abs(x+w-X)*math.abs(Y-(y+h));
            negativeSpace += overlap;
          } else if (x <= X+W && X+W < x+w && y <= Y+H && Y+H <= y+h) {
            const overlap = math.abs(x+w-X)*math.abs(Y+H-y);
            negativeSpace += overlap;
          }
        } else {

        }
      }
    }
  }

  const NSpercent = (negativeSpace/(1080*1080)*100).toFixed(2);
  //percent로 바꿔서 보내기
  return NSpercent 
}

function CalVerticalSymmetry() {
  const json = JSON.parse(fs.readFileSync('./send.json'));
  const childrenList = json.pages[0].children;
}

io.on('connection', socket =>{
  console.log("New client connected");
  socket.on('change', data => {
    const angleResult = CalAngleLevel(data);
    const textResult = CalTextSize(data);
    const componentGap = GetGap(data);
    const alignment = CalAlignment(data);
    const negativeSpace = CalNegativeSpace(data);
    const result = {
      angleResult: angleResult,
      textResult: textResult,
      componentGap: componentGap,
      alignment: alignment,
      negativeSpace: negativeSpace,
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
