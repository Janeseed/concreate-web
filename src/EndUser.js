import React from 'react';
import { withRouter } from "react-router-dom";
import { CompactPicker } from 'react-color';
import io from 'socket.io-client';
//import polotno libraries
import { PolotnoContainer, WorkspaceWrap } from 'polotno';
import Workspace from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { unstable_registerNextDomDrop } from 'polotno/config';

//import parts of UIs
import './index.css';
import './textToolbar';
import './svgToolbar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Popover2 } from '@blueprintjs/popover2';
import { Button } from '@blueprintjs/core';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

//import svg urls
const motifUrl = process.env.PUBLIC_URL + '/graphics-05.svg';
const motifUrl2 = process.env.PUBLIC_URL + '/graphics-04.svg';
const motifUrl3 = process.env.PUBLIC_URL + '/tea-leaf-06.svg';
const motifUrl4 = process.env.PUBLIC_URL + '/coffee-bean-05.svg';

const logoUrl = process.env.PUBLIC_URL + 'muwieWordmark.svg';
const logoUrl2 = process.env.PUBLIC_URL + 'brandLogo-03.svg';
const logoUrl3 = process.env.PUBLIC_URL + 'brandLogo-04.svg';
const logoUrl4 = process.env.PUBLIC_URL + 'brandLogo-05.svg';

const KRtitleURL = process.env.PUBLIC_URL + 'text-03.svg';
const KRbodyURL = process.env.PUBLIC_URL + 'text-04.svg';
const ENGtitleURL = process.env.PUBLIC_URL + 'text-05.svg';
const ENGbodyURL = process.env.PUBLIC_URL + 'text-06.svg';

const shapes1 =  process.env.PUBLIC_URL + 'shapes-01.svg';
const shapes2 =  process.env.PUBLIC_URL + 'shapes-02.svg';
const shapes3 =  process.env.PUBLIC_URL + 'shapes-03.svg';
const shapes4 =  process.env.PUBLIC_URL + 'shapes-04.svg';
const shapes5 =  process.env.PUBLIC_URL + 'shapes-05.svg';
const shapes6 =  process.env.PUBLIC_URL + 'shapes-06.svg';
const shapes7 =  process.env.PUBLIC_URL + 'shapes-07.svg';
const shapes8 =  process.env.PUBLIC_URL + 'shapes-08.svg';
const shapes9 =  process.env.PUBLIC_URL + 'shapes-09.svg';
const shapes10 =  process.env.PUBLIC_URL + 'shapes-10.svg';
const shapes11 =  process.env.PUBLIC_URL + 'shapes-11.svg';

//import images
const moodImage1 = process.env.PUBLIC_URL + '/jeongSeon_Incheon.jpg';
const moodImage2 = process.env.PUBLIC_URL + '/jeongseon.jpg';
const moodImage3 = process.env.PUBLIC_URL + '/coffee_bean_pattern.png';
const moodImage4 = process.env.PUBLIC_URL + '/baekJa.png';
const colorPalette = process.env.PUBLIC_URL + './color_palette.png';

const colorDescription = process.env.PUBLIC_URL + './colorDescription.png';
const compositionDescription = process.env.PUBLIC_URL + './compositionDescription.png';
const formDescription = process.env.PUBLIC_URL + './formDescription.png';
const textDescription = process.env.PUBLIC_URL + './textDescription.png';

class EndUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandPersonalityKeywords: ['Truthful', 'Sincere', 'Comfortable'],
      backgroundColor: '#ffffff',
      colors: ['#414042', "#6d6e71", '#939598', '#bcbec0', '#e6e7e8', '#ffffff',
        '#131f2b', '#283747','#485a6f','#687f9c', '#849ebd', '#a9c1e0',
        '#703a0d','#8f4f16', '#bf6a1e', "#db863c", '#e8a061', '#f5b682',
        '#a86722', '#c98d46', '#e6b277', '#ebc192', '#f2d3b1', '#f2e2d0',
        '#3d3504', '#594f0a','#81720f','#b09d25', '#d1bc3a', '#f2df68', '#050505'],
      imgSrcURL: null,
      jsonFromDesigner: null,
      textSizeMax: 0,
      textSizeMin: 0,
      checkTextMax: true,
      checkTextMin: true,
      negativeSpace: 0,
      checkNegativeSpace: true,
      IsChanged: false,
      changedReason: null,
      score: {
        feedbackColor: '',
        scoreBrightness: 4,
        scoreSaturation: 4,
        scoreContrast: 4,
        scoreDivergence: 4,
        feedbackText: '',
        scoreTextSize: 4,
        scoreTextStroke: 4,
        feedbackForm: '',
        scoreShape: 4,
        scoreLine: 4,
        feedbackLayout: '',
        scoreSymmetry: 4,
        scoreArrangement: 4,
        scoreAlignment: 4,
        scoreDirection: 4,
        scoreNegativeSpace: 4,
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

    socket.on('requestedFeedback', data => {
      this.setState({jsonFromDesigner: data, IsChanged: true});
    });

    socket.on('getAssessment', data => {
      console.log(data);
      this.setState({score: data});
    })

    socket.on('sendDataURL', data => {
      this.setState({imgSrcURL: data});
    });

  }

  componentWillUnmount() {    
    const store = this.store;
    const socket = this.socket;

    socket.on('requestedFeedback', data => {
      console.log('requestedFeedback');
      this.setState({jsonFromDesigner: data, IsChanged: true});
    });

    socket.on('getAssessment', data => {
      this.setState({score: data});
    })

    socket.on('sendDataURL', data => {
      this.setState({imgSrcURL: data});
    });
  }

  render() {
    const store = this.store;
    const socket = this.socket;
    const score = this.state.score;

    return (
      <PolotnoContainer className="polotno-app-container">
        <Box sx={{width: 320, padding: 2}}>
          <Stack direction='column' justifyContent='space-between'>
            <div>
              <div className='background-section'>
                <h3 className='title'>Background Color</h3>
                <CompactPicker
                  colors={this.state.colors}
                  onChangeComplete = {this.handleBackColorChange}
                />
              </div>
              <div className='textSection'>
                <h3 className="title">Text</h3>
                <div className='text-grid'>
                  <div className='text-input'>
                    <img
                      width='40'
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
                            text: '?????? ?????? ?????? ??????',
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
                  </div>
                  <div className='text-input'>
                    <img
                      width='40'
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
                            text: '?????? ????????? ???????????? ??? ????????? ?????? ??????????????? ???????????? ???????????? ???????????????.',
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
                  </div>
                  <div className='text-input'>
                    <img
                      width='40'
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
                  </div>
                  <div className='text-input'>
                    <img
                      width='40'
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
                </div>
              </div>
              <div className='logo-section'>
                <h3>Logo</h3>
                <div id='logo-grid'>
                  <div className="logo-input">
                    <img
                      width='50'
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
                  </div>
                  <div className="logo-input">
                    <img
                      width='50'
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
                  </div>
                  <div className="logo-input">
                    <img
                      width='50'
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
                            height: 35.535,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                      alt = 'logo'
                    />
                  </div>
                  <div className="logo-input">
                    <img
                      width='50'
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
              </div>
              <div className='motif-section'>
                <h3>Graphic Motifs</h3>
                <div id='motif-grid'>
                  <div className='motif-input'>
                    <img
                      height='50'
                      src = {motifUrl}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: motifUrl,
                            keepRatio: true,
                            x: pos.x,
                            y: pos.y,
                            width: 175,
                            height: 177.2647,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                      alt = 'logo'
                    />
                  </div>
                  <div className='motif-input'>
                    <img
                      height='50'
                      src = {motifUrl2}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: motifUrl2,
                            keepRatio: true,
                            x: pos.x,
                            y: pos.y,
                            width: 175,
                            height: 177.2647,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                      alt = 'logo'
                    />
                  </div>
                  <div className='motif-input'>
                    <img
                      height='50'
                      src = {motifUrl3}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: motifUrl3,
                            keepRatio: true,
                            x: pos.x,
                            y: pos.y,
                            width: 90,
                            height: 198.6,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                      alt = 'logo'
                    />
                  </div>
                  <div className='motif-input'>
                    <img
                      height='50'
                      src = {motifUrl4}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: motifUrl4,
                            keepRatio: true,
                            x: pos.x,
                            y: pos.y,
                            width: 140,
                            height: 177,
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
              </div>
              <div className='vector-section'>
                <h3>Basic Shapes</h3>
                <div id ='vector-grid'>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes1}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes1,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 104,
                            height: 104,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes2}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes2,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 98,
                            height: 98,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes3}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes3,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 105,
                            height: 100,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes4}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes4,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 105,
                            height: 100,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes5}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes5,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 60,
                            height: 86,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes6}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes6,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 104,
                            height: 104,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes7}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes7,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 98,
                            height: 98,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes8}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes8,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 105,
                            height: 100,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes9}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes9,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 105,
                            height: 100,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes10}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes10,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 60,
                            height: 86,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                  <div className='vector-input'>
                    <img
                      height='40'
                      src = {shapes11}
                      draggable = "true"
                      onDragStart={() => {
                        unstable_registerNextDomDrop((pos, element) => {
                          // "pos" - is relative mouse position of drop
                          // "element" - is element from your store in case when DOM object is dropped on another element
                          store.activePage.addElement({
                            type: 'svg',
                            src: shapes11,
                            keepRatio: false,
                            x: pos.x,
                            y: pos.y,
                            width: 7,
                            height: 95,
                          })
                        })
                      }}
                      onDragEnd={() => {
                        unstable_registerNextDomDrop(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="finish-button"
              onClick={() => {
                store.saveAsImage();
              }}
            >
              Finish
            </Button>
          </Stack>
        </Box>
        <WorkspaceWrap>
          <Toolbar
            store={store}
            downloadButtonEnabled={false}
            hideTextEffects={true}
            hideOpacity={true}
          />
          <Workspace store={store} pageControlsEnabled={false}/>
        </WorkspaceWrap>
        <Box sx={{width: 400, padding: 2}}>
          <Stack direction ='row' spacing={2} alignItems="center">
            <h3>Brand Personality</h3>
            <Popover2
              content={
                <Box sx={{padding: 2}}>
                  <p className='BPkeywords'>Keyword: Reliable, Sincere, Essential</p>
                  <p className='BPdescriptionKR'>
                    ??????????????? '????????????'??? ????????? ?????? ?????????,
                    ???????????? ??? ????????? ?????? ??????????????? ???????????????
                    ????????? ????????? ?????? ???????????? ????????? ???????????????.  
                  </p>
                  <p className='BPkeywords'>Color of Muwie</p>
                  <p className='BPdescriptionKR'>
                    ??????????????? Primary Color??? ????????? ??????????????? ?????? ??? ?????? ?????? ?????? ???????????? ???????????????.<br></br>
                    ?????? ????????? ??? ?????? Secondary Color??? ????????? ?????? ???????????? ?????? ??? ?????? 3?????? ????????? ????????????.  
                  </p>
                  <img
                    className='bpImage'
                    src={colorPalette}
                  />
                  <div id='bpImages'>
                    <p className='image-title'>Mood Board of Muwie</p>
                    <p className='BPdescriptionKR'>
                    ????????? ???????????? ?????? ???????????? ???????????? ????????? ????????? ????????? ?????????.
                    <br></br>
                    ???????????? ???????????? ???????????? ?????? ?????? ?????? ?????? ????????????
                    ????????? ????????? ??? ?????? ???????????? ???????????????.  
                    </p>
                    <div className='image-grid'>
                      <img
                        className='bpImage'
                        height='250'
                        src={moodImage1}
                      />
                      <img
                        className='bpImage'
                        height='250'
                        src={moodImage2}
                      />
                      <img
                        className='bpImage'
                        height='250'
                        src={moodImage3}
                      />
                      <img
                        className='bpImage'
                        height='250'
                        src={moodImage4}
                      />
                    </div>
                  </div>
                </Box>
              }
              placement='auto'
            >
              <Button className="user-buttons">Show BP</Button>
            </Popover2>
          </Stack>
          <div id="recommendation-section">
            <Stack direction ='row' spacing={2} alignItems="center">
              <h3>Recommendation</h3>
              <Button
                className="user-buttons"
                onClick={() => {
                  const requestJson = store.toJSON();
                  socket.emit('request', requestJson);
                }}
              >
                Request
              </Button>
            </Stack>
            <img
              id='previewImage'
              width='200'
              height='200'
              src = {this.state.imgSrcURL}
            />
            <div id="description">
              <div>
                {
                  this.state.IsChanged ?
                  <Button
                    className = 'user-buttons'
                    onClick={() => {
                      store.loadJSON(this.state.jsonFromDesigner, true);
                      this.setState({IsChanged: false});
                  }}>
                    Apply
                  </Button>
                  : null
                }
              </div>
            </div>
            <div>
              <Box sx={{padding: 1}}>
                <Stack direction ='row' spacing={2}>
                  <p className='score-group-title'>Color</p>
                  <Popover2
                    content={
                      <img 
                        src={colorDescription}
                        alt='description of color score'
                      />
                    }
                    placement='auto'
                  >
                    <HelpOutlineIcon color="secondary"/>
                  </Popover2>
                </Stack>
                <Stack direction ='row' spacing={2}>
                  <div className='score-section'>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Brightness</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreBrightness} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Saturation</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreSaturation} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                  </div>
                  <div className='score-section'>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Contrast</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreContrast} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Divergence</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreDivergence} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                  </div>
                </Stack>
                <p className='feedback-description'>{score.feedbackColor}</p>
              </Box>
              <Box sx={{padding: 1}}>
                <Stack direction ='row' spacing={2}>
                  <p className='score-group-title'>Text</p>
                  <Popover2
                    content={
                      <img 
                        src={textDescription}
                        alt='description of text score'
                      />
                    }
                    placement='auto'
                  >
                    <HelpOutlineIcon color="secondary"/>
                  </Popover2>
                </Stack>
                <Stack direction ='row' spacing={2}>
                  <Stack direction='row' alignItems="center" justifyContent='space-between'>
                    <p>Text Size</p>
                    <Box sx={{width: 90}}>
                      <Slider value={score.scoreTextSize} step={1} marks min={1} max={7} disabled />
                    </Box>
                  </Stack>
                  <Stack direction='row' alignItems="center" justifyContent='space-between'>
                    <p>Text Stroke</p>
                    <Box sx={{width: 90}}>
                      <Slider value={score.scoreTextStroke} step={1} marks min={1} max={7} disabled />
                    </Box>
                  </Stack>
                </Stack>
                <p className='feedback-description'>{score.feedbackText}</p>
              </Box>
              <Box sx={{padding: 1}}>
                <Stack direction ='row' spacing={2}>
                  <p className='score-group-title'>Object Form</p>
                  <Popover2
                    content={
                      <img 
                        src={formDescription}
                        alt='description of object form score'
                      />
                    }
                    placement='auto'
                  >
                    <HelpOutlineIcon color="secondary"/>
                  </Popover2>
                </Stack>
                <Stack direction ='row' spacing={2}>
                  <Stack direction='row' alignItems="center" justifyContent='space-between'>
                    <p>Shape</p>
                    <Box sx={{width: 90}}>
                      <Slider value={score.scoreShape} step={1} marks min={1} max={7} disabled />
                    </Box>
                  </Stack>
                  <Stack direction='row' alignItems="center" justifyContent='space-between'>
                    <p>Line</p>
                    <Box sx={{width: 90}}>
                      <Slider value={score.scoreLine} step={1} marks min={1} max={7} disabled />
                    </Box>
                  </Stack>
                </Stack>
                <p className='feedback-description'>{score.feedbackForm}</p>
              </Box>
              <Box sx={{padding: 1}}>
                <Stack direction ='row' spacing={2}>
                  <p className='score-group-title'>Composition</p>
                  <Popover2
                    content={
                      <img 
                        src={compositionDescription}
                        alt='description of composition score'
                      />
                    }
                    placement='auto'
                  >
                    <HelpOutlineIcon color="secondary"/>
                  </Popover2>
                </Stack>
                <Stack direction ='row' spacing={2}>
                  <div className='score-section'>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Symmetry</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreSymmetry} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Arrangement</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreArrangement} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Alignment</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreAlignment} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                  </div>
                  <div className='score-section'>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Direction</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreDirection} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                    <Stack direction='row' alignItems="center" justifyContent='space-between'>
                      <p>Negative <br></br>Space</p>
                      <Box sx={{width: 90}}>
                        <Slider value={score.scoreNegativeSpace} step={1} marks min={1} max={7} disabled />
                      </Box>
                    </Stack>
                  </div>
                </Stack>
                <p className='feedback-description'>{score.feedbackLayout}</p>
              </Box>
            </div>
          </div>
        </Box>
      </PolotnoContainer>
    );
  }
}

export default withRouter(EndUser);
