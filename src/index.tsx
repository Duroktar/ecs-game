import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './app/styles/index.css';

import { system } from './game';
import App from './app/App';

ReactDOM.render(<App system={system} />, document.getElementById('root'));
