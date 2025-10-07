import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="loader">
      <div className="svg-wrapper">
        <svg
          id="b"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 113.1 113.1"
          height="80"
          fill=""
        >
          <defs>
            <linearGradient id="ttb" y2="1">
              <stop offset="100%" stopOpacity="1" stopColor="#333">
                <animate
                  attributeName="offset"
                  values="0;1;1;0"
                  repeatCount="indefinite"
                  dur="4s"
                  begin="0s"
                />
              </stop>
              <stop offset="100%" stopOpacity="1" stopColor="#E0E0E0">
                <animate
                  attributeName="offset"
                  values="0;1;1;0"
                  repeatCount="indefinite"
                  dur="4s"
                  begin="0s"
                />
              </stop>
            </linearGradient>
            <style>
              {`.d {fill:#a12242;} .e {fill:#6b1c31;}`}
            </style>
          </defs>
          <g id="c">
            <path
              className="d"
              d="m87.7.7v23.2l-13.2,13.2V12.3L86.5.2c.4-.4,1.1-.1,1.1.5"
            />
            <polygon
              className="d"
              points="72.1 14.6 72.1 39.4 58.9 52.6 58.9 27.8 72.1 14.6"
            />
            <polygon
              className="e"
              points="54.2 27.8 54.2 52.6 41 39.4 41 14.6 54.2 27.8"
            />
            <path
              className="e"
              d="m38.7,12.3v24.8l-13.2-13.2V.7c0-.6.7-.9,1.1-.5l12.1,12.1Z"
            />
            <path
              className="d"
              d="m38.7,76.1v24.8l-12.1,12.1c-.4.4-1.1.1-1.1-.5v-23.2l13.2-13.2Z"
            />
            <polygon
              className="d"
              points="54.2 60.5 54.2 85.3 41 98.5 41 73.8 54.2 60.5"
            />
            <polygon
              className="e"
              points="72.1 73.8 72.1 98.5 58.9 85.3 58.9 60.5 72.1 73.8"
            />
            <path
              className="e"
              d="m87.7,89.3v23.2c0,.6-.7.9-1.1.5l-12.1-12.1v-24.8l13.2,13.2Z"
            />
            <path
              className="d"
              d="m112.5,87.6h-23.2l-13.2-13.2h24.8l12.1,12.1c.4.4.1,1.1-.5,1.1"
            />
            <polygon
              className="d"
              points="98.5 72.1 73.8 72.1 60.6 58.9 85.3 58.9 98.5 72.1"
            />
            <polygon
              className="e"
              points="98.5 41 85.3 54.2 60.6 54.2 73.8 41 98.5 41"
            />
            <path
              className="e"
              d="m112.9,26.6l-12.1,12.1h-24.8l13.2-13.2h23.2c.6,0,.9.7.5,1.1"
            />
            <path
              className="d"
              d="m37,38.7H12.3L.2,26.6c-.4-.4-.1-1.1.5-1.1h23.2l13.2,13.2Z"
            />
            <polygon
              className="d"
              points="52.6 54.2 27.8 54.2 14.6 41 39.4 41 52.6 54.2"
            />
            <polygon
              className="e"
              points="52.6 58.9 39.4 72.1 14.6 72.1 27.8 58.9 52.6 58.9"
            />
            <path
              className="e"
              d="m37,74.4l-13.2,13.2H.7c-.6,0-.9-.7-.5-1.1l12.1-12.1h24.8Z"
            />
          </g>
        </svg>
        <div className="loading-text">Cargando...</div>
        <div className="loading-messages">
          <div className="message">Enviando...</div>
          <div className="message">Analizando salida...</div>
          <div className="message">Subiendo Formulario...</div>
        </div>

      </div>
    </div>
  );
};

export default Preloader;
