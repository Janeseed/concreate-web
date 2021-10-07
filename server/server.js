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

function CalTextSize (json) {

  const childrenList = json.pages[0].children;

  const textSizes = [];

  for (let x in childrenList) {
    if (childrenList[x].type === "text") {
      textSizes.push(childrenList[x].fontSize.toFixed(1));
    };
  };

  textSizes.sort(function(a,b){return a-b});

  const minText = textSizes[0];
  const maxText = textSizes[textSizes.length-1];
  var checkMin = true;
  var checkMax = true;
  
  if (minText > 44) {
    checkMin = false;
  } else {
    checkMin = true;
  }

  if (maxText > 90.5) {
    checkMax= false;
  } else {
    checkMax = true;
  }

  return {
    minText: minText,
    checkMax: checkMax,
    maxText: maxText,
    checkMin: checkMin,
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
    const angle = (childrenList[x].rotation).toFixed(2);
    angles.push(angle);
  }

  const average = arr => arr.reduce((a,b) => a+b, 0) / arr.length;
  angles.sort(function(a,b){return a-b}); //sorting numbers in ascending orders
  
  for (let x =0; x < angles.length-1; x++) {
    if ( angles[x] != angles[x+1]) {
      const diff = angles[x+1]-angles[x];
      differences.push(diff);
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
      averageAngle: average(angles),
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

  var xCoords = [];
  for (let i in childrenList) {
    xCoords.push(childrenList[i].x);
    xCoords.push(childrenList[i].x + childrenList[i].width);
  }

  let new_xCoords = [...new Set(xCoords)]; //duplicated check
  new_xCoords.sort(function(a, b) { //reorder
    return a - b;
  });

  var new_rects = [];
  for (let i in childrenList) {
    var _xCoords = [];

    _xCoords.push(childrenList[i].x);
    for (let j in new_xCoords) {
      if(childrenList[i].x + childrenList[i].width > new_xCoords[j] && childrenList[i].x < new_xCoords[j]){
        _xCoords.push(new_xCoords[j]);
      }
    }
    _xCoords.push(childrenList[i].x  + childrenList[i].width);

    for (var j = 0; j < _xCoords.length - 1; j++) {
      new_rects.push({
        x: _xCoords[j],
        y: childrenList[i].y,
        width: _xCoords[j+1] - _xCoords[j],
        height: childrenList[i].height
      });
    }
  }

  var xAlignedRects = []; //x & width 같은것 모은 array
  while(new_rects.length > 0){
    var _temp_rects = [];
    var _idx = [];
    for (let i in new_rects){
      var x = new_rects[0].x;
      var y = new_rects[0].y;
      var h = new_rects[0].height;
      var X = new_rects[i].x;
      var Y = new_rects[i].y;
      var H = new_rects[i].height;

      if(x == X){
        if(y > Y && y < Y+H){
          _idx.push(i);
        }else if(y+h > Y && y+h < Y+H){
          _idx.push(i);
        }
      }

      _idx.push(0);
    }
    let _newidx = [...new Set(_idx)]; //duplicated check
    _newidx.sort(function(a, b) { //reorder
      return a - b;
    });

    for(let j in _newidx){
      _temp_rects.push(new_rects[_newidx[j]]);
    }
    for(let k in _newidx){
      new_rects.splice(_newidx[k]-k,1);
    }

    xAlignedRects.push(_temp_rects);

    _temp_rects = [];
    _idx = [];
  }


  var finalRect = [];
  for(let i in xAlignedRects){
    var _minY = Number.POSITIVE_INFINITY;
    var _maxY = 0;
    for(let j in xAlignedRects[i]){
      if(xAlignedRects[i][j].y < _minY) _minY = xAlignedRects[i][j].y;
      if(xAlignedRects[i][j].y + xAlignedRects[i][j].height > _maxY) _maxY = xAlignedRects[i][j].y + xAlignedRects[i][j].height;
    }

    finalRect.push({
      x: xAlignedRects[i][0].x,
      y: _minY,
      width: xAlignedRects[i][0].width,
      height: _maxY-_minY
    })
  }

  var sumRectArea = 0;
  for(let i in finalRect){
    sumRectArea = sumRectArea + (finalRect[i].width * finalRect[i].height);
  }

  const NSpercent = ((1-sumRectArea/(1080*1080))*100).toFixed(2);
  var checkNS = true;
  if ( NSpercent < 49.95) {
    checkNS = false;
  } else {
    checkNS = true;
  }
  //percent로 바꿔서 보내기
  return {
    NSpercent: NSpercent,
    checkNS: checkNS,
  }; 
}

// function CalHorzSymmetry(imgURL) {
//   // 이미지 url로 가져오기
//   const buf = Buffer.from(imgURL, 'base64');
//   Jimp.read(buf, (err, image) => {
//     if (err) {console.log(err)};
//     const imageClone = image.clone();
//     image.writeAsync('test.png');
//   });
  
//   // const imageClone = image.clone();
//   // const leftImg = await image.crop(0,0,1217,1696).writeAsync('Left.jpg');
//   // const RightImg = await imageClone.flip(true,false).crop(0,0,1217,1696).writeAsync('Right.jpg');

//   // var diff = Jimp.diff(leftImg, RightImg);
//   // const result = (diff.percent*100).toFixed(1);
//   // return result;
// }

// function CalVerSymmetry(imgURL) {
//   // 이미지 url로 가져오기
//   return imgURL;
//   // const image = Jimp.read(imgURL);
//   // const imageClone = image.clone();
//   // const topImg = await image.crop(0,0,2434,848).writeAsync('top.jpg').catch(e => {console.log(e)});
//   // const bottomImg = await imageClone.flip(false,true).crop(0,0,2434,848).writeAsync('bottom.jpg').catch(e => {console.log(e)});
  
//   // var diff = Jimp.diff(topImg, bottomImg);
//   // const result = (diff.percent*100).toFixed(1);
//   // return result;
// }

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
  // socket.on('changeURL', data => {
  //   CalHorzSymmetry(data);
  // })
  socket.on('requestJson', data => {
    io.emit('requestJson', data);
    console.log('requestJson');
  });
  socket.on('requestedJson', data => {
    // fs.writeFile('./get.json', JSON.stringify(data), (err) => {
    //   if (err) throw err;
    // });
    // console.log('requested json saved');
    io.emit('requestedJson', data);
    console.log('requestedJson');
  });
  socket.on('sendJson', data => {
    // fs.writeFile('./send.json', JSON.stringify(data), (err) => {
    //   if (err) throw err;
    // });
    io.emit('sendJson', data);
    console.log('sendJson');
  });
  socket.on('sendDataURL', data => {
    io.emit('sendDataURL', data);
    console.log('sendDataURL');
  });
})
