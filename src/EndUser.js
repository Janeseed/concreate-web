import React from 'react';
import { withRouter } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { CompactPicker } from 'react-color';
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
import { Popover2 } from '@blueprintjs/popover2';
import { Button } from '@blueprintjs/core';

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

const shapes1 =  process.env.PUBLIC_URL + 'shapes-06.svg';
const shapes2 =  process.env.PUBLIC_URL + 'shapes-07.svg';
const shapes3 =  process.env.PUBLIC_URL + 'shapes-08.svg';
const shapes4 =  process.env.PUBLIC_URL + 'shapes-09.svg';
const shapes5 =  process.env.PUBLIC_URL + 'shapes-10.svg';
const shapes6 =  process.env.PUBLIC_URL + 'shapes-11.svg';
const shapes7 =  process.env.PUBLIC_URL + 'shapes-12.svg';
const shapes8 =  process.env.PUBLIC_URL + 'shapes-13.svg';
const shapes9 =  process.env.PUBLIC_URL + 'shapes-14.svg';
const shapes10 =  process.env.PUBLIC_URL + 'shapes-15.svg';
const shapes11 =  process.env.PUBLIC_URL + 'shapes-16.svg';

//import images
const moodImage1 = process.env.PUBLIC_URL + '/jeongSeon_Incheon.jpg';
const moodImage2 = process.env.PUBLIC_URL + '/jeongseon.jpg';
const moodImage3 = process.env.PUBLIC_URL + '/coffee_bean_pattern.png';
const moodImage4 = process.env.PUBLIC_URL + '/baekJa.png';



class EndUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandPersonalityKeywords: ['Truthful', 'Sincere', 'Comfortable'],
      backgroundColor: '#ffffff',
      colors: ['#414042', "#6d6e71", '#939598', '#bcbec0', '#e6e7e8', '#ffffff',
        '#703a0d','#8f4f16', '#bf6a1e', "#db863c", '#e8a061', '#f5b682',
        '#a86722', '#c98d46', '#e6b277', '#ebc192', '#f2d3b1', '#f2e2d0',
        '#131f2b', '#283747','#485a6f','#687f9c', '#849ebd', '#a9c1e0',
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

    socket.on('requestedFeedback', () => {
      //data에 json 파일 보내기
      //가능하면 data에 이미지 파일도 같이 넣어서 보내기
    });

    socket.on('sendDataURL', data => {
      // data를 어레이에 담아서 받기
      // 각 이미지 소스를 setstate하기
    });

  }

  componentWillUnmount() {    
    const store = this.store;
    const socket = this.socket;

    //이후에 async function들 여기에 넣기
  }

  render() {
    const store = this.store;
    const socket = this.socket;

    //Palette Section Panel
    const CustomSection = {
      name: 'custom',
      Tab: (props) => (<div></div>),
      // we need observer to update component automatically on any store changes
      Panel: observer(({ store }) => {
        return (
          <div>
            <div className='background-section'>
              <h2 className='title'>Background Color</h2>
              <CompactPicker
                colors={this.state.colors}
                onChangeComplete = {this.handleBackColorChange}
              />
            </div>
            <div className='textSection'>
              <h2 className="title">Text</h2>
              <div className='text-grid'>
                <div className='text-input'>
                  <img
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
                </div>
                <div className='text-input'>
                  <img
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
                </div>
                <div className='text-input'>
                  <img
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
                </div>
                <div className='text-input'>
                  <img
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
              </div>
            </div>
            <div className='logo-section'>
              <h2>Logo</h2>
              <div id='logo-grid'>
                <div className="logo-input">
                  <img
                    width='70'
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
                    width='70'
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
                    width='70'
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
                    width='78'
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
              <h2>Graphic Motifs</h2>
              <div id='motif-grid'>
                <div className='motif-input'>
                  <img
                    height='60'
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
                    height='60'
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
                    height='60'
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
                    height='60'
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
              <h2>Basic Shapes</h2>
              <div id ='vector-grid'>
                <div className='vector-input'>
                  <img
                    height='50'
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
                    height='50'
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
                    height='50'
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
                          width: 110,
                          height: 95.26,
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
                    height='50'
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
                    height='50'
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
                    height='50'
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
                <div className='vector-input'>
                  <img
                    height='50'
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
                    height='50'
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
                    height='50'
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
                          width: 110,
                          height: 95.26,
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
                    height='50'
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
                    height='50'
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
        );
      }),
    };

    const AiSection = {
      name: 'estimate',
      Tab: () => (<div></div>),
      // we need observer to update component automatically on any store changes
      Panel: observer(({store}) => {
        return(
          <div>
            <div className='BPSection'>
              <h2>Brand Personality</h2>
              <Popover2
                content={
                  <div id ='BPSection'>
                    <p className='BPkeywords'>Keyword: Reliable, Sincere, Essential</p>
                    <p className='BPdescriptionKR'>
                      무위커피는 '무위자연'의 무위를 따온 것으로,
                      꾸밈없이 꼭 필요한 것만 정성스럽게 담아낸다는
                      무위의 커피에 대한 정직함과 신뢰를 의미합니다.  
                    </p>
                    <p className='BPdescription'>
                      Muwie Coffee is a honest and truthful coffee shop
                      delivering only necessary goods and taking away
                      additional embellishments.  
                    </p>
                    <div id='bpImages'>
                      <p className='image-title'>Mood Board of Muwie</p>
                      <p className='BPdescriptionKR'>
                        정선의 풍경화와 조선 달항아리 백자처럼 비움의 미학을 닮고자 한다.
                        <br></br>
                        전체적인 브랜드의 상품들은 모두 손수 만든 듯한 느낌으로
                        정성을 표현할 수 있는 방식으로 전달한다.  
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
                  </div>
                }
                placement='auto'
              >
                <Button className="user-buttons">Show BP Information</Button>
              </Popover2>
            </div>
            <div id="recommendation-section">
              <h2>Recommendation</h2>
              <Button
                className="user-buttons"
                onClick={() => {
                  const requestJson   
                }}
              >
                Request
              </Button>
              <img
                id='previewImage'
                width='250'
                height='250'
                src = {this.state.imgSrcURL}
              />
              <div id="description">
                <h3 style={{color: 'red'}}>{this.state.IsChanged ? "New Recommandation!" : null}</h3>
                <div>
                  {
                    this.state.IsChanged ?
                    <Button
                      className = 'user-buttons'
                      onClick={() => {
                        store.loadJSON(this.state.jsonFromDesigner, true);
                        this.setState({IsChanged: !this.state.IsChanged});
                    }}>
                      Apply
                    </Button>
                    : null
                  }

                </div>
              </div>
            </div>
          </div>
        );
      }),
    };

    //section을 지정해주는 곳
    const sections = [CustomSection];
    const estimateSections = [AiSection];

    return (
      <PolotnoContainer className="polotno-app-container">
        <SidePanelWrap >
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

export default withRouter(EndUser);
