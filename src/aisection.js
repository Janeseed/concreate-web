import React from 'react';

//observer for customization
import { observer } from 'mobx-react-lite';

import { SectionTab } from 'polotno/side-panel';

// import icon
import FaCompass from '@meronex/icons/fa/FaCompass';

//section for AI support (estimate brand personality)
export const AiSection = {
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
          <p>Elements on the current page: {store.activePage?.children.length}</p>
        </div>
      );
    }),
  };