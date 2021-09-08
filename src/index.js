import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { SwatchesPicker, CirclePicker } from 'react-color';
import io from 'socket.io-client'
//import polotno libraries
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
import { setGoogleFonts } from 'polotno/config';

//import parts of UIs
import { AiSection } from './aisection';
import logo from './index.css';

// import icon
import BiPalette from '@meronex/icons/bi/BiPalette';
import './vocali_logo.svg';

const socket = io.connect('http://143.248.250.173:3002');
const json = [];

socket.on('toBack', data => {
  console.log(data);
  json.push(data);
  console.log('successfully get json data');
}); 

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
        text: '키위커피 타이틀 입력',
        fontSize: 102,
        fontFamily: 'Cafe24SsurroundAir',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'bold', // can be normal or bold or some other CSS variations
        fill: '#005508',
        align: 'left',
        width: 700,
      },
      bodyStyle: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 350,
        text: '입력할 내용을 작성하세요.',
        fontSize: 52,
        fontFamily: 'Cafe24SsurroundAir',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'normal', // can be normal or bold or some other CSS variations
        fill: 'black',
        align: 'left',
        width: 700,
      },
      primaryColor: ['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB'],
      secondaryColor: ['#FFB800', '#FF2525', '#614600'],
      neutralColor: ['#ffffff','#bfbfbf','#808080', '#404040', '#000000'],
      logo: {
        type: 'svg',
        src: 'https://s.cdpn.io/3/kiwi.svg', //relative path 면 안되는 이유가 뭐지? 클라이언트에 같이 보여지는게 아니라서..?
        maskSrc: '', // should we draw mask image over svg element?
        keepRatio: false, // can we change aspect ration of svg?
        x: 0,
        y: 0,
        rotation: 0,
        locked: false,
        blurEnabled: false,
        blurRadius: 0,
        brightnessEnabled: false,
        brightness: 0,
        shadowEnabled: false,
        shadowBlur: 0,
        width: 100,
        height: 100,
        flipX: false,
        flipY: false,
      },
      graphicMotif: {
        type: 'svg',
        src: 'https://s.cdpn.io/3/kiwi.svg',
        maskSrc: '', // should we draw mask image over svg element?
        keepRatio: false, // can we change aspect ration of svg?
        x: 0,
        y: 0,
        rotation: 0,
        locked: false,
        blurEnabled: false,
        blurRadius: 0,
        brightnessEnabled: false,
        brightness: 0,
        shadowEnabled: false,
        shadowBlur: 0,
        width: 100,
        height: 100,
        flipX: false,
        flipY: false,
      },
    };
    this.store = createStore({
      key: 'RVVmbQODqrPZUXq1u5AN', // you can create it here: https://polotno.dev/cabinet/
      // you can hide back-link on a paid licence
      // but it will be good if you can keep it for Polotno project support
      showCredit: true,
    });
    this.store.setSize(1080, 1080);
    this.page = this.store.addPage();
    this.store.addFont({
      fontFamily: 'ghanachoco',
      url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ghanachoco.woff',
    });
  }

  handleOnClickLogo = () => {
    this.store.activePage?.addElement(this.state.logo);
  };

  handleOnClickMotif = () => {
    this.store.activePage?.addElement(this.state.graphicMotif);
  };

  handleBackColorChange = (color) => {
    this.setState({
      backgroundColor: color.hex,
    });
    this.store.activePage?.set({
      background: this.state.backgroundColor
    });
  };

  handleSocketio = (store) => {
    const json = store.toJSON();
    socket.emit('save', JSON.stringify(json));
  };

  handleLoad = (store) => {
    const clientWork = JSON.parse(json[0]);
    store.loadJSON(clientWork, true);
  };

  render() {
    const store = this.store;

    //set the fonts here
    setGoogleFonts([]);

    //Palette Section Panel
    const CustomSection = {
      name: 'custom',
      Tab: (props) => (
        <SectionTab name="Brand Palette" {...props}>
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
              <div>
                <p>Primary Color</p>
                <CirclePicker
                  colors={this.state.primaryColor}
                  circleSpacing={7}
                  onChangeComplete={this.handleBackColorChange}
                />
              </div>
              <div>
                <p>Secondary Color</p>
                <CirclePicker
                  colors={this.state.secondaryColor}
                  circleSpacing={7}
                  onChangeComplete={this.handleBackColorChange}
                />
              </div>
              <div>
                <p>Neutral Color</p>
                <CirclePicker
                  colors={this.state.neutralColor}
                  circleSpacing={7}
                  onChangeComplete={this.handleBackColorChange}
                />
              </div>
            </div>
            <div className='logo-section'>
              <h2>Logo</h2>
              <Button onClick={this.handleOnClickLogo} />
            </div>
            <div className='motif-section'>
              <h2>Graphic Motifs</h2>
              <Button onClick={this.handleOnClickMotif} />
            </div>
            <div>
              <h2>Estimate the Result</h2>
              <Button onClick={() => {this.handleSocketio(store)}}>
                Save
              </Button>
              <Button onClick={() => {this.handleLoad(store)}}>
                Load
              </Button>
            </div>
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