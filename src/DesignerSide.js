import React from 'react';
import { withRouter } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { SketchPicker, CirclePicker } from 'react-color';
import io from 'socket.io-client';
//import polotno libraries
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { SidePanel } from 'polotno/side-panel';
import Workspace from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { unstable_registerNextDomDrop } from 'polotno/config';

//import parts of UIs
import './index.css';
import './textToolbar';
import './svgToolbar';

//import svg urls
const motifUrl = process.env.PUBLIC_URL + '/motif_example.svg';

const logoUrl = process.env.PUBLIC_URL + 'muwieWordmark.svg';
const logoUrl2 = process.env.PUBLIC_URL + 'brandLogo-03.svg';
const logoUrl3 = process.env.PUBLIC_URL + 'brandLogo-04.svg';
const logoUrl4 = process.env.PUBLIC_URL + 'brandLogo-05.svg';

const KRtitleURL = process.env.PUBLIC_URL + 'text-03.svg';
const KRbodyURL = process.env.PUBLIC_URL + 'text-04.svg';
const ENGtitleURL = process.env.PUBLIC_URL + 'text-05.svg';
const ENGbodyURL = process.env.PUBLIC_URL + 'text-06.svg';

class DesignerSide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandPersonalityKeywords: ['Truthful', 'Sincere', 'Comfortable'],
      backgroundColor: '#ffffff',
      primaryColor: ['#005508', '#168621', "#9BDB68", '#BAF989', '#E2FFCB'],
      secondaryColor: ['#FFB800', '#FF2525', '#614600'],
      neutralColor: ['#ffffff','#bfbfbf','#808080', '#404040', '#000000'],
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
      alignment: '',
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
        componentAngleDiff: JSON.stringify(data.angleResult),
        textSize: JSON.stringify(data.textResult),
        gapBetweenComponents: JSON.stringify(data.componentGap),
        alignment: JSON.stringify(data.alignment),
        negativeSpace: data.negativeSpace,
      });
    });
    socket.on('showSymm', data => {
      this.setState({
        symmetryHorizontal: data.horizSymmetry,
      });
    });
  };

  componentWillUnmount() {
    const store = this.store;
    const socket = this.socket;

    socket.on('requestedJson', data => {
      store.loadJSON(data, true);
    });
    socket.on('show', data => {
      this.setState({
        componentAngleDiff: JSON.stringify(data.angleResult),
        textSize: JSON.stringify(data.textResult),
        gapBetweenComponents: JSON.stringify(data.componentGap),
        alignment: JSON.stringify(data.alignment),
        negativeSpace: data.negativeSpace,
      });
    });
    socket.on('showSymm', data => {
      this.setState({
        symmetryHorizontal: data.horizSymmetry
      });
    });
  }

  render() {
    const store = this.store;
    const socket = this.socket;

    //Palette Section Panel
    const CustomSection = {
      name: 'custom',
      Tab: () => (<div></div>),
      // we need observer to update component automatically on any store changes
      Panel: observer(({ store }) => {
        return (
          <div>
            <div className='textSection'>
              <h2>Text</h2>
              <img
                className='text'
                width='50'
                src = {KRtitleURL}
                draggable = "true"
                onDragStart={() => {
                  unstable_registerNextDomDrop((pos, element) => {
                    // "pos" - is relative mouse position of drop
                    // "element" - is element from your store in case when DOM object is dropped on another element
                    store.activePage.addElement({
                      type: 'text',
                      x: pos.x,
                      y: pos.y,
                      text: '무위 커피 제목 입력',
                      fontSize: 72,
                      fontFamily: 'Noto Sans KR',
                      fontStyle: 'normal', // can be normal or italic
                      fontWeight: 'bold', // can be normal or bold or some other CSS variations
                      fill: '#414042',
                      align: 'left',
                      width: 700,
                    })
                  })
                }}
                onDragEnd={() => {
                  unstable_registerNextDomDrop(null);
                }}
                alt = 'logo'
              />
              <img
                className='text'
                width='50'
                src = {KRbodyURL}
                draggable = "true"
                onDragStart={() => {
                  unstable_registerNextDomDrop((pos, element) => {
                    // "pos" - is relative mouse position of drop
                    // "element" - is element from your store in case when DOM object is dropped on another element
                    store.activePage.addElement({
                      type: 'text',
                      x: pos.x,
                      y: pos.y,
                      text: '무위 커피는 꾸밈없이 꼭 필요한 것만 정성스럽게 담아내는 정직함을 추구합니다.',
                      fontSize: 32,
                      fontFamily: 'Noto Sans KR',
                      fontStyle: 'normal', // can be normal or italic
                      fontWeight: '300', // can be normal or bold or some other CSS variations
                      fill: '#050505',
                      align: 'left',
                      width: 700,
                    })
                  })
                }}
                onDragEnd={() => {
                  unstable_registerNextDomDrop(null);
                }}
                alt = 'logo'
              />
              <img
                className='text'
                width='50'
                src = {ENGtitleURL}
                draggable = "true"
                onDragStart={() => {
                  unstable_registerNextDomDrop((pos, element) => {
                    // "pos" - is relative mouse position of drop
                    // "element" - is element from your store in case when DOM object is dropped on another element
                    store.activePage.addElement({
                      type: 'text',
                      x: pos.x,
                      y: pos.y,
                      text: 'Title Text Here',
                      fontSize: 72,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal', // can be normal or italic
                      fontWeight: '600', // can be normal or bold or some other CSS variations
                      fill: '#414042',
                      align: 'left',
                      width: 700,
                    })
                  })
                }}
                onDragEnd={() => {
                  unstable_registerNextDomDrop(null);
                }}
                alt = 'logo'
              />
              <img
                className='text'
                width='45'
                src = {ENGbodyURL}
                draggable = "true"
                onDragStart={() => {
                  unstable_registerNextDomDrop((pos, element) => {
                    // "pos" - is relative mouse position of drop
                    // "element" - is element from your store in case when DOM object is dropped on another element
                    store.activePage.addElement({
                      type: 'text',
                      x: pos.x,
                      y: pos.y,
                      text: 'Muwie delievers only the necessary goods and takes away additional embellishments',
                      fontSize: 32,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal', // can be normal or italic
                      fontWeight: '200', // can be normal or bold or some other CSS variations
                      fill: '#050505',
                      align: 'left',
                      width: 700,
                    })
                  })
                }}
                onDragEnd={() => {
                  unstable_registerNextDomDrop(null);
                }}
                alt = 'logo'
              />
            </div>
            <div className='background-section'>
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
              <div id='logoList'>
                <img
                  className='logo'
                  width='80'
                  src = {logoUrl}
                  draggable = "true"
                  onDragStart={() => {
                    unstable_registerNextDomDrop((pos, element) => {
                      // "pos" - is relative mouse position of drop
                      // "element" - is element from your store in case when DOM object is dropped on another element
                      store.activePage.addElement({
                        type: 'svg',
                        src: logoUrl,
                        keepRatio: true,
                        x: pos.x,
                        y: pos.y,
                        width: 180,
                        height: 139.115,
                      })
                    })
                  }}
                  onDragEnd={() => {
                    unstable_registerNextDomDrop(null);
                  }}
                  alt = 'logo'
                />
                <img
                  className='logo'
                  width='80'
                  src = {logoUrl2}
                  draggable = "true"
                  onDragStart={() => {
                    unstable_registerNextDomDrop((pos, element) => {
                      // "pos" - is relative mouse position of drop
                      // "element" - is element from your store in case when DOM object is dropped on another element
                      store.activePage.addElement({
                        type: 'svg',
                        src: logoUrl2,
                        keepRatio: true,
                        x: pos.x,
                        y: pos.y,
                        width: 180,
                        height: 102.777
                      })
                    })
                  }}
                  onDragEnd={() => {
                    unstable_registerNextDomDrop(null);
                  }}
                  alt = 'logo'
                />
                <img
                  className='logo'
                  width='80'
                  src = {logoUrl3}
                  draggable = "true"
                  onDragStart={() => {
                    unstable_registerNextDomDrop((pos, element) => {
                      // "pos" - is relative mouse position of drop
                      // "element" - is element from your store in case when DOM object is dropped on another element
                      store.activePage.addElement({
                        type: 'svg',
                        src: logoUrl3,
                        keepRatio: true,
                        x: pos.x,
                        y: pos.y,
                        width: 180,
                        height: 25.664,
                      })
                    })
                  }}
                  onDragEnd={() => {
                    unstable_registerNextDomDrop(null);
                  }}
                  alt = 'logo'
                />
                <img
                  className='logo'
                  width='80'
                  src = {logoUrl4}
                  draggable = "true"
                  onDragStart={() => {
                    unstable_registerNextDomDrop((pos, element) => {
                      // "pos" - is relative mouse position of drop
                      // "element" - is element from your store in case when DOM object is dropped on another element
                      store.activePage.addElement({
                        type: 'svg',
                        src: logoUrl4,
                        keepRatio: true,
                        x: pos.x,
                        y: pos.y,
                        width: 180,
                        height: 45.58,
                      })
                    })
                  }}
                  onDragEnd={() => {
                    unstable_registerNextDomDrop(null);
                  }}
                  alt = 'logo'
                />
              </div>
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
            <div className='BPSection'>
              <h2>Brand Personality</h2>
              <h4>Keyword: Fancy, Young, Playful</h4>
              <p>
                Nudake is a place where your dessert fantasies come alive.
                We make the most unique desserts inspired by fashion, art,
                and your own sweet dreams.
              </p>
            </div>
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
    const sections = [CustomSection];
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
