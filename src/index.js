import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import ContextWrapper from '~/context/ContextWrapper';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyles>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </GlobalStyles>
  </React.StrictMode>,
);

reportWebVitals();
