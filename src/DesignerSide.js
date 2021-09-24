import React from 'react';
import { withRouter } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup, TextArea } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { SketchPicker, CirclePicker } from 'react-color';
import io from 'socket.io-client';
//import polotno libraries
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { ElementsSection } from 'polotno/side-panel';
import { SectionTab, SidePanel } from 'polotno/side-panel';
import Workspace from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { addGlobalFont, setGoogleFonts } from 'polotno/config';

//import parts of UIs
import './index.css';
import myFonts from './fonts';
import './textToolbar';
import './svgToolbar';

// import icon
import BiPalette from '@meronex/icons/bi/BiPalette';

//import svg urls
const motifUrl = process.env.PUBLIC_URL + '/motif_example.svg';
const logoUrl = 'https://assets.codepen.io/3/kiwi.svg';

class DesignerSide extends React.Component {
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
        keepRatio: true, // can we change aspect ration of svg?
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
        width: 612,
        height: 502.174,
        flipX: false,
        flipY: false,
      },
      graphicMotif: {
        type: 'svg',
        src: motifUrl,
        maskSrc: '', // should we draw mask image over svg element?
        keepRatio: true, // can we change aspect ration of svg?
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
        width: 300.7,
        height: 464.7,
        flipX: false,
        flipY: false,
      },
      colorBrightness: 0,
      colorSaturation: 0,
      colorDivergent: 0,
      colorDiff: 0,
      titleTypeface: '',
      titleStroke: 0,
      numTypeface: 0,
      textSize: 0,
      symmetryHorizontal: 0,
      symmetryVertical: 0,
      gapBetweenComponents: '',
      alignment: 0,
      componentAngleDiff: 0,
      negativeSpace: 0,
      descriptionToSee: '',
      descriptionToSend: '',
    };
    this.store = createStore({
      key: 'NcHyMlHqjQJUyb4mwfEr', // you can create it here: https://polotno.dev/cabinet/
      // you can hide back-link on a paid licence
      // but it will be good if you can keep it for Polotno project support
      showCredit: true,
    });
    this.store.setSize(1080, 1080);
    this.page = this.store.addPage();
    this.socket = io.connect('http://143.248.250.173:3002');
  }

  handleBackColorChange = (color) => {
    this.setState({
      backgroundColor: color.hex,
    });
    this.store.activePage?.set({
      background: this.state.backgroundColor
    });
  };

  componentDidMount() {
    const store = this.store;
    const socket = this.socket;
    
    socket.on('requestedJson', data => {
      store.loadJSON(data, true);
    });
    socket.on('show', data => {
      this.setState({
        componentAngleDiff: data.angleResult,
        textSize: data.textResult,
        gapBetweenComponents: data.componentGap,
      });
    });
  };

  componentWillUnmount() {
    const store = this.store;
    const socket = this.socket;
    
    setGoogleFonts(['Roboto', 'Roboto Condensed', 'Anton', 'Tenor Sans', 'Krona One', 'Montserrat', 'Roboto Slab', 'EB Garamond', 'Abril Fatface', 'Playfair Display', 'Lora','Libre Baskerville', 'Cinzel', 'Arvo', 'Permanent Marker', 'Amatic SC', 'Great Vibes', 'Rock Salt', 'Cedarville Cursive']);
    myFonts.map(fontOject => addGlobalFont(fontOject))

    socket.on('requestedJson', data => {
      store.loadJSON(data, true);
    });
    socket.on('show', data => {
      this.setState({
        componentAngleDiff: data.angleResult,
        textSize: data.textResult,
        gapBetweenComponents: data.componentGap,
      });
    });
  }

  render() {
    const store = this.store;
    const socket = this.socket;
    
    //set the fonts here
    setGoogleFonts(['Roboto', 'Roboto Condensed', 'Anton', 'Tenor Sans', 'Krona One', 'Montserrat', 'Roboto Slab', 'EB Garamond', 'Abril Fatface', 'Playfair Display', 'Lora','Libre Baskerville', 'Cinzel', 'Arvo', 'Permanent Marker', 'Amatic SC', 'Great Vibes', 'Rock Salt', 'Cedarville Cursive']);
    myFonts.map(fontOject => addGlobalFont(fontOject))

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
                Nudake is a place where your dessert fantasies come alive.
                We make the most unique desserts inspired by fashion, art,
                and your own sweet dreams.
              </p>
            </div>
            <div className='textSection'>
              <h2>Text</h2>
              <ButtonGroup style={{ minWidth: 200 }} vertical={true} alignText={'center'}>
                <Button
                  onClick={() => {store.activePage?.addElement(this.state.titleStyleKR);}}
                  className='text-header'
                >
                  한글 제목
                </Button>
                <Button
                  onClick={() => {store.activePage?.addElement(this.state.bodyStyleKR);}}
                  className='text-body'
                >
                  한글 본문
                </Button>
                <Button
                  onClick={() => {store.activePage?.addElement(this.state.titleStyleENG);}}
                  className='text-header'
                >
                  Create English Header
                </Button>
                <Button
                  onClick={() => {store.activePage?.addElement(this.state.bodyStyleENG);}}
                  className='text-body'
                >
                  Create English Body Text
                </Button>
              </ButtonGroup>
            </div>
            <div className='background-section'>
              <div style={{
                }}>
                <h2>Background Color</h2>
                <div style={{
                  margin: '10px',
                }}>
                <Popover2
                  content={
                  <SketchPicker
                    color={store.activePage?.background}
                    onChangeComplete = {this.handleBackColorChange}
                    presetColors = {['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB', '#FFB800', '#FF2525', '#614600', '#ffffff','#bfbfbf','#808080', '#404040', '#000000']}
                  />
                  }
                >
                  <Button
                    style = {{
                      width: '80px',
                      height: '80px',
                      background: `${store.activePage?.background}`,
                      border: '5px',
                    }}
                  />
                </Popover2>
                </div>
              </div>
              <div className="color-line">
                <p className="color-line-title">Primary</p>
                <CirclePicker
                  colors={this.state.primaryColor}
                  circleSize={20}
                  circleSpacing={5}
                  onChangeComplete = {this.handleBackColorChange}
                />
              </div>
              <div className="color-line">
                <p className="color-line-title">Secondary</p>
                <CirclePicker
                  colors={this.state.secondaryColor}
                  circleSize={20}
                  circleSpacing={5}
                  onChangeComplete = {this.handleBackColorChange}
                />
              </div>
              <div className="color-line">
                <p className="color-line-title">Neutral</p>
                <CirclePicker
                  colors={this.state.neutralColor}
                  circleSize={20}
                  circleSpacing={5}
                  onChangeComplete = {this.handleBackColorChange}
                />
              </div>
            </div>
            <div className='logo-section'>
              <h2>Logo</h2>
              <img
                className='previewImage'
                width='100'
                src = {logoUrl}
                alt = 'logo'
                onClick={() => {store.activePage?.addElement(this.state.logo)}}
              />
            </div>
            <div className='motif-section'>
              <h2>Graphic Motifs</h2>
              <img
                className='previewImage'
                height='100'
                src = {motifUrl}
                alt = 'motif'
                onClick={() => {store.activePage?.addElement(this.state.graphicMotif)}}
              />
            </div>
          </div>
        );
      }),
    };
    
    const AiSection = {
      name: 'estimate',
      Tab: () => (<div></div>),
      // we need observer to update component automatically on any store changes
      Panel: observer(({store}) => {
        return(
          <>
            <h2>File</h2>
            <Button
              className="designer-buttons"
              onClick={() => {
                socket.emit('requestJson');
              }}
            >
              GET
            </Button>
            <Button
              className="designer-buttons"
              onClick={() => {
                const sendJson = store.toJSON();

                const maxWidth = 200;
                const scale = maxWidth / store.width;
                const imageBase64 = store.toDataURL({ pixelRatio: scale });
                
                socket.emit('sendJson', sendJson);
                socket.emit('sendDataURL', imageBase64);
              }}
            >
              SEND
            </Button>
            <div id="designer-score-section">
              <h2>User Data</h2>
              <div id="dseigner-side-scores">
                <h3>text</h3>
                <ul>
                  <li>title typeface stroke: {this.state.titleStroke}</li>
                  <li>text size: {this.state.textSize}</li>
                </ul>
                <h3>layout</h3>
                <ul>
                  <li>horizontal symmetry: {this.state.symmetryHorizontal}</li>
                  <li>vertical symmetry: {this.state.symmetryVertical}</li>
                  <li>Gap between components: {this.state.gapBetweenComponents}</li>
                  <li>alignment: {this.state.alignment}</li>
                  <li>angle between components: {this.state.componentAngleDiff}</li>
                  <li>negative space: {this.state.negativeSpace}</li>
                </ul>
              </div>
            </div>

          </>
        );
      }),
    };

    //section을 지정해주는 곳
    const sections = [CustomSection, ElementsSection];
    const estimateSections = [AiSection];

    return (
      <PolotnoContainer className="polotno-app-container">
        <SidePanelWrap>
          <SidePanel store={store} sections={sections} defaultSection="custom" />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar
            store={store}
            downloadButtonEnabled={false}
            hideTextEffects={true}
            hideOpacity={true}
          />
          <Workspace store={store} pageControlsEnabled={false}/>
        </WorkspaceWrap>
        <SidePanelWrap>
          <SidePanel store={store} sections={estimateSections} defaultSection='estimate'/>
        </SidePanelWrap>
      </PolotnoContainer>
    );
  }
}

export default withRouter(DesignerSide);
