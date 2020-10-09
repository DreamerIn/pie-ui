import React from 'react';
import StimulusTabs from '../main';
import { shallow } from 'enzyme';

const props = {
  tabs:[
    {
      id:1,
      title: "one",
      text: "text for one"
    },
    {
      id:2,
      title: "two",
      text: "text for two"
    }
  ]
};


describe('stimulus tabs', () => {
  describe('snapshot', () => {
    it('should render component', () => {
      const wrapper = shallow(
        <StimulusTabs
          tabs={props.tabs}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });


});
