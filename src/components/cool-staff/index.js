import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import './index.css'

class CoolStaff extends HTMLElement {
  connectedCallback() {
    // const mountPoint = document.createElement('section');
    // mountPoint.width = 100;
    // mountPoint.height = 100;
    // this.attachShadow({mode: 'open'}).appendChild(mountPoint);
    // const name = this.getAttribute('name');
    ReactDOM.render(<Root />, this);
  }
}

customElements.define('cool-staff', CoolStaff);
