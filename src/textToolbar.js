import React from 'react';
import { observer } from 'mobx-react-lite';
import { NumericInput, Navbar, Alignment, Button } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { unstable_registerToolbarComponent } from 'polotno/config';
import { SketchPicker } from 'react-color';

import {
  FontFamilyInput,
  FontSizeInput,
  FontStyleGroup,
  FontColorInput,
  SpacingInput
} from "polotno/toolbar/text-toolbar";

const TextToolbar = observer(({store}) => {
  const element = store.selectedElements[0];
  const textLineMenu = (
    <div
      style = {{
        display: 'flex',
        margin: '2px',
      }}
    >
      <Popover2
        content={
        <SketchPicker
          color={element.stroke}
          onChange = {(color) => {
            element.set({ stroke: color.hex});
          }}
          presetColors = {['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB', '#FFB800', '#FF2525', '#614600', '#ffffff','#bfbfbf','#808080', '#404040', '#000000']}
        />
        }
      >
        <Button
          style = {{
            width: '30px',
            height: '30px',
            background: `${element.stroke}`,
            border: '2px',
          }}
        />
      </Popover2>
      <NumericInput 
        onValueChange={(strokeWidth) => {
          element.set({ strokeWidth: strokeWidth });
        }}
        value={element.strokeWidth}
        style={{ width: "50px", marginLeft: "10px" }}
        min={0}
        max={40}
      />
    </div>
  );
  return (
    <Navbar.Group align={Alignment.LEFT}>
      <Popover2
        content={
        <SketchPicker
          color={element.fill}
          onChange = {(color) => {
            element.set({ fill: color.hex});
          }}
          presetColors = {['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB', '#FFB800', '#FF2525', '#614600', '#ffffff','#bfbfbf','#808080', '#404040', '#000000']}
        />
        }
      >
        <Button
          style = {{
            width: '30px',
            height: '30px',
            background: `${element.fill}`,
            border: '2px',
          }}
        />
      </Popover2>
      <FontFamilyInput store={store} element={element} />
      <FontSizeInput store={store} element={element}/>
      <FontStyleGroup store={store} element={element} />
      <SpacingInput store={store} element={element} />
      <Popover2
        content={textLineMenu}
      >
        <Button text="Text Stroke" minimal={true} />
      </Popover2>
    </Navbar.Group>
  );
});

unstable_registerToolbarComponent('text', TextToolbar);