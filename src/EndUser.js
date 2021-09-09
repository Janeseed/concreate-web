import React from 'react';
import { withRouter } from "react-router-dom";
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
//import AiPanel from './AiPanel';
import './index.css';
import myFonts from './fonts';

// import icon
import BiPalette from '@meronex/icons/bi/BiPalette';
import FaCompass from '@meronex/icons/fa/FaCompass';

//import svg urls
const motifUrl = process.env.PUBLIC_URL + '/motif_example.svg';
const logoUrl = process.env.PUBLIC_URL + '/vocali_logo.svg';

const socket = io.connect('http://143.248.250.173:3002');
const json = [];

socket.on('toBack', data => {
  console.log(data);
  json.push(data);
  console.log('successfully get json data');
});

var jsonFromDesigner;
socket.on('sendJson', data => {
  // store.loadJSON(data);
  jsonFromDesigner = data;
  console.log('get json from designer')
});

class EndUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandPersonalityKeywords: ['Fancy', 'Young', 'Playful'],
      backgroundColor: '#ffffff',
      titleStyleKR: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 100,
        text: '키위커피 타이틀 입력',
        fontSize: 102,
        fontFamily: '카페24써라운드에어',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'bold', // can be normal or bold or some other CSS variations
        fill: '#005508',
        align: 'left',
        width: 700,
      },
      bodyStyleKR: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 350,
        text: '입력할 내용을 작성하세요.',
        fontSize: 52,
        fontFamily: '카페24써라운드에어',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'normal', // can be normal or bold or some other CSS variations
        fill: 'black',
        align: 'left',
        width: 700,
      },
      titleStyleENG: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 100,
        text: 'Body Text Here',
        fontSize: 102,
        fontFamily: 'Playfair Display',
        fontStyle: 'normal', // can be normal or italic
        fontWeight: 'bold', // can be normal or bold or some other CSS variations
        fill: '#005508',
        align: 'left',
        width: 700,
      },
      bodyStyleENG: {
        // default value of text inputs
        type: 'text',
        x: 100,
        y: 350,
        text: 'Body Text Contents Here',
        fontSize: 52,
        fontFamily: 'Playfair Display',
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
        src: logoUrl, //relative path 면 안되는 이유가 뭐지? 클라이언트에 같이 보여지는게 아니라서..?
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
        src: motifUrl,
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
      imageSrcUrl: null,
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

  addMyFonts = (fontObject) => {
    this.store.addFont(fontObject);
  };

  render() {
    const store = this.store;

    //set the fonts here
    setGoogleFonts(['Roboto', 'Roboto Condensed', 'Anton', 'Tenor Sans', 'Krona One', 'Montserrat', 'Roboto Slab', 'EB Garamond', 'Abril Fatface', 'Playfair Display', 'Lora','Libre Baskerville', 'Cinzel', 'Arvo', 'Permanent Marker', 'Amatic SC', 'Great Vibes', 'Rock Salt', 'Cedarville Cursive']);
    myFonts.map(this.addMyFonts);

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
                    store.activePage?.addElement(this.state.titleStyleKR);
                  }}
                  className='text-header'
                >
                  한글 제목
                </Button>
                <Button
                  onClick={() => {
                    store.activePage?.addElement(this.state.bodyStyleKR);
                  }}
                  className='text-body'
                >
                  한글 본문
                </Button>
                <Button
                  onClick={() => {
                    store.activePage?.addElement(this.state.titleStyleENG);
                  }}
                  className='text-header'
                >
                  Create English Header
                </Button>
                <Button
                  onClick={() => {
                    store.activePage?.addElement(this.state.bodyStyleENG);
                  }}
                  className='text-header'
                >
                  Create English Body Text
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

    const AiSection = {
      name: 'estimate',
      Tab: (props) => (
        <SectionTab name="Estimate" {...props}>
          <FaCompass icon="new-text-box" />
        </SectionTab>
      ),
      // we need observer to update component automatically on any store changes
      Panel: observer(({store}) => {
        return(
          <div>
            <h2>Recommandation</h2>
            <img className='previewImage'
            width='200'
            height='200'
            //소스 이미지 여기로 넣는 것 맞나요
            src = {this.state.imgSrcURL}
            onClick={() => store.loadJSON(jsonFromDesigner)}
            />
          </div>
        );
      }),
    };

    socket.on('requestJson', data => {
      console.log('requestJson')
      const requestedJson = store.toJSON();
      socket.emit('requestedJson', requestedJson);
    });

    socket.on('sendDataURL', data => {
      this.setState({
        imgSrcURL: data,
      });
      console.log('get dataURL from designer')
    });

    //section을 지정해주는 곳
    const sections = [CustomSection, ElementsSection];
    const estimateSections = [AiSection];

    return (
      <PolotnoContainer className="polotno-app-container">
        <SidePanelWrap>
          <SidePanel store={store} sections={sections} defaultSection="custom" />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} dwonloadButtonEnabled hideTextEffects={false} hideOpacity={true} />
          <Workspace store={store} pageControlsEnabled={false}/>
        </WorkspaceWrap>
        <SidePanelWrap>
          <SidePanel store={store} sections={estimateSections} defaultSection='estimate'/>
        </SidePanelWrap>
      </PolotnoContainer>
    );
  }
}

export default withRouter(EndUser);
