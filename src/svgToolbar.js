import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navbar, Alignment, Button } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { unstable_registerToolbarComponent } from 'polotno/config';
import { SketchPicker } from 'react-color';


export const SvgToolbar = observer(({store}) => {
  const element = store.selectedElements[0];
  
  return (
    <Navbar.Group align={Alignment.LEFT}>
      {!element.maskSrc &&
        element.colors.slice(0, 5).map((original) => {
          return(
            <Popover2
              content={
              <SketchPicker
                color={element.colorsReplace.get(original) || original}
                onChange = {(color) => {
                  element.replaceColor(original, color.hex);
                }}
                presetColors = {['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB', '#FFB800', '#FF2525', '#614600', '#ffffff','#bfbfbf','#808080', '#404040', '#000000']}
              />
              }
            >
              <Button
                style = {{
                  width: '30px',
                  height: '30px',
                  background: `${element.colorsReplace.get(original) || original}`,
                  border: '2px',
                }}
              />
            </Popover2>
          );
      })}
    </Navbar.Group>
  );
});

unstable_registerToolbarComponent('svg', SvgToolbar);