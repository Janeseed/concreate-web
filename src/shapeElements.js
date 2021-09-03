import React from 'react';
import ReactDOM from 'react-dom';
// polotno is made with mobx library
// we will need its tools to make reactive components
import { observer } from 'mobx-react-lite';
import { unstable_registerShapeModel } from 'polotno/config';
// import Konva components
import { Rect, Circle, Star, Line} from 'react-konva';

// define our model
// we need to provide all default values
unstable_registerShapeModel({
    type: 'rect',
    innerWidth: 100,
    innerHeight: 100,
    fill: '#0f0f0f',
});

