import React from 'react';
import ReactDOM from 'react-dom';
import APIKeys from './APIKeys';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<APIKeys />, div);
  ReactDOM.unmountComponentAtNode(div);
});
