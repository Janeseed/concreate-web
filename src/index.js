import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { SwatchesPicker, CirclePicker } from 'react-color';

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import {
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
} from 'polotno/side-panel';
import { SectionTab, SidePanel } from 'polotno/side-panel';
import Workspace from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { Toolbar } from 'polotno/toolbar/toolbar';

//import parts of UIs
import { AiSection } from './aisection';
// import './shapeElements';

// import icon
import BiPalette from '@meronex/icons/bi/BiPalette';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandPersonalityKeywords: ['Fancy', 'Young', 'Playful'],
      backgroundColor: '#ffffff',
      titleStyle: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 100,
        text: 'Type Header Here',
        fontSize: 72,
        fontFamily: 'Roboto',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'bold', // can be normal or bold or some other CSS variations
        fill: 'red',
        align: 'left',
        width: 500,
      },
      bodyStyle: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 300,
        text: 'Type body text Here dummy dummy',
        fontSize: 32,
        fontFamily: 'Roboto',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'normal', // can be normal or bold or some other CSS variations
        fill: 'black',
        align: 'left',
        width: 700,
      },
      primaryColor: ['#B80000', '#DB3E00', "#FCCB00", '#008B02', '#006B76'],
      secondaryColor: ['#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA'],
      neutralColor: ['#3D3D3D', '#0f0f0f'],
    };
    this.store = createStore({
      key: 'RVVmbQODqrPZUXq1u5AN', // you can create it here: https://polotno.dev/cabinet/
      // you can hide back-link on a paid licence
      // but it will be good if you can keep it for Polotno project support
      showCredit: true,
    });
    this.store.setSize(1080, 1080);
    this.page = this.store.addPage();
  }

  handleBackColorChange = (color) => {
    this.setState({
      backgroundColor: color.hex,
    });
    this.page.set({
      background: this.state.backgroundColor
    });
  };

  render() {
    const store = this.store;

    //Palette Section Panel
    const CustomSection = {
      name: 'custom',
      Tab: (props) => (
        <SectionTab name="Palette" {...props}>
          <BiPalette icon="new-text-box" />
        </SectionTab>
      ),
      // we need observer to update component automatically on any store changes
      Panel: observer(({ store }) => {
        return (
          <div>
            <div className='BPSection'>
              <h2>Brand Personality</h2>
              <h4>Keyword: Fancy, Young, Playful</h4>
              <p>
                Nudake is a place where your dessert fantasies come alive. We make the most unique desserts inspired by fashion, art, and your own sweet dreams.
              </p>
            </div>
            <div className='textSection'>
              <h2>Text</h2>
              <ButtonGroup style={{ minWidth: 200 }} vertical={true} alignText={'center'}>
                <Button
                  onClick={() => {
                    store.activePage?.addElement(this.state.titleStyle);
                  }}
                  className='text-header'
                >
                  Create Header
                </Button>
                <Button
                  onClick={() => {
                    store.activePage?.addElement(this.state.bodyStyle);
                  }}
                  className='text-body'
                >
                  Create Body Text
                </Button>
              </ButtonGroup>
            </div>
            <div className='background-section'>
              <h2>Background Color</h2>
              <CirclePicker
                colors={this.state.primaryColor}
                circleSpacing={7}
                onChangeComplete={this.handleBackColorChange}
              />
              <CirclePicker
                colors={this.state.secondaryColor}
                circleSpacing={7}
                onChangeComplete={this.handleBackColorChange}
              />
              <CirclePicker
                colors={this.state.neutralColor}
                circleSpacing={7}
                onChangeComplete={this.handleBackColorChange}
              />
            </div>
            <div className='logo-section'>
              <h2>Logo</h2>
            </div>
            <div className='motif-section'>
              <h2>Graphic Motifs</h2>
            </div>
            {/* <div className='shapes-section'>
              <h2>Basic Shapes</h2>
              <Button 
                onClick = {store.activePage?.addElement({
                  type: 'star',
                  radius: 100,
                  fill: 'red',
                })}
              />
            </div> */}
          </div>
        );
      }),
    };


    //section을 지정해주는 곳
    const sections = [CustomSection, ElementsSection, AiSection];

    return (
      <PolotnoContainer className="polotno-app-container">
        <SidePanelWrap>
          <SidePanel store={store} sections={sections} defaultSection="custom" />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} dwonloadButtonEnabled hideTextEffects={false} hideOpacity={true} />
          <Workspace store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));