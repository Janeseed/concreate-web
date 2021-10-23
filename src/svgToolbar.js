import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navbar, Alignment, Button } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { unstable_registerToolbarComponent } from 'polotno/config';
import { CompactPicker } from 'react-color';


export const SvgToolbar = observer(({store}) => {
  const element = store.selectedElements[0];
  const colors = ['#414042', "#6d6e71", '#939598', '#bcbec0', '#e6e7e8', '#ffffff',
  '#703a0d','#8f4f16', '#bf6a1e', "#db863c", '#e8a061', '#f5b682',
  '#a86722', '#c98d46', '#e6b277', '#ebc192', '#f2d3b1', '#f2e2d0',
  '#131f2b', '#283747','#485a6f','#687f9c', '#849ebd', '#a9c1e0',
  '#3d3504', '#594f0a','#81720f','#b09d25', '#d1bc3a', '#f2df68', '#050505'];
  return (
    <Navbar.Group align={Alignment.LEFT}>
      {!element.maskSrc &&
        element.colors.slice(0, 5).map((original) => {
          return(
            <Popover2
              content={
                <CompactPicker
                  color={element.colorsReplace.get(original) || original}
                  onChange = {(color) => {
                    element.replaceColor(original, color.hex);
                  }}
                  colors = {colors}
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