import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './wrapper';
import '../css/app.scss';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Wrapper />, document.getElementById('wrapper'));
