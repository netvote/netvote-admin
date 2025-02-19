import React from 'react';
import ReactDOM from 'react-dom';
import Usage from './Usage';

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Polar: () => null,
  Pie: () => null,
  Radar: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Usage />, div);
  ReactDOM.unmountComponentAtNode(div);
});