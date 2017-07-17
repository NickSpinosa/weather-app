import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Container from './containers/wheather-container/wheather-container';

ReactDOM.render(<Container />, document.getElementById('root'));
registerServiceWorker();
