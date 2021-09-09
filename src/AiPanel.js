import React from 'react';

//observer for customization
import { observer } from 'mobx-react-lite';

import { SectionTab } from 'polotno/side-panel';

// import icon
import FaCompass from '@meronex/icons/fa/FaCompass';

import io from 'socket.io-client'
const socket = io.connect('http://143.248.250.206:3002');

var jsonFromDesigner;
socket.on('sendJson', data => {
  // store.loadJSON(data);
  jsonFromDesigner = data;
  console.log('sendJson')
});

const url = [];

socket.on('sendDataURL', data => {
  url.push(data);
  console.log('sendDataURL')
});

class AiPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrcUrl: null,
    };
  }

  //여기에 소켓에서 받아온 url 이미지를 this.state.imageSrcUrl에 넣는 함수 만들기
  componentDidMount() {
    const scrURL = url[0]; 
    this.setState({
      imgSrcURL: scrURL,
    });
  };

  render() {
    //section for AI support (estimate brand personality)
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
            />
          </div>
        );
      }),
    };

    return (
      <AiSection />
    );
  }
}

export default AiPanel;