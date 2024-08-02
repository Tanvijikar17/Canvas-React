import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CanvasComponent from './component/canvas';
import reportWebVitals from './reportWebVitals';
// import { Canvas } from 'react-sketch-canvas';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    {/* <CanvasComponent imageUrl="http://www.w3.org/2000/svg" /> */}
    <CanvasComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
