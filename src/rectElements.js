import React from 'react';
// polotno is made with mobx library
// we will need its tools to make reactive components
import { observer } from 'mobx-react-lite';
import { unstable_registerShapeComponent, unstable_registerShapeModel, unstable_registerTransformerAttrs } from 'polotno/config';
// import Konva components
import { Rect, Circle, Star, Line } from 'react-konva';
// polotno util function
import { useSnap } from 'polotno/canvas/use-snap';

// define our model
// we need to provide all default values
unstable_registerShapeModel({
  type: 'rect',
  width: 100,
  height: 100,
  fill: '#0f0f0f',
});

export const RectElement = observer(({element, store}) => {
  const ref = React.useRef(null);
  // useSnap - is utility hook that automatically enables snapping
  const { onDragMove, onDragEnd } = useSnap(ref);

  const handleChange = (e) => {
    const node = e.currentTarget;
    const scaleX = node.scaleX();
    // Konva.Transformer is changing scale by default
    // we don't need that, so we reset it back to 1.
    node.scaleX(1);
    node.scaleY(1);
    // and then save all changes back to the model
    element.set({
      x: node.x(),
      y: node.y(),
      rotation: e.target.rotation(),
      radius: element.radius * scaleX,
    });
  };

  return (
    <Rect
      ref = {ref}
      name = "element"
      id={element.id}
      x={element.x}
      y={element.y}
      fill={element.fill}
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      innerWidth={element.innerWidth}
      innerHeight={element.innerHeight}
      onDragMove={handleChange}
      onTransform={handleChange}
    />
  );    
});

unstable_registerShapeComponent('rect', RectElement);
unstable_registerTransformerAttrs('rect', {
  enabledAnchors: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
});

/*
// now we can define custom toolbar
const LineToolbar = observer(({ store }) => {
  const element = store.selectedElements[0];

  return (
    <Navbar.Group align={Alignment.LEFT}>
      <ColorPicker
        value={element.fill}
        onChange={(fill) =>
          element.set({
            fill,
          })
        }
        store={store}
      />
      <NumericInput
        onValueChange={(val) => {
          element.set({ innerWidth: val });
        }}
        value={element.innerWidth}
        style={{ width: '50px', marginLeft: '10px' }}
        min={1}
        max={500}
      />
    </Navbar.Group>
  );
});

unstable_registerShapeComponent('rect', LineToolbar);
*/
