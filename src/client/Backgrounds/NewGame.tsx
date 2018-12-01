import * as React from 'react';
import './styles/StarField.style.css';
import './styles/Logo.style.css';

export function NewGame() {
  return (
    <div id="starfield" className="background">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="logo-container" className="slide-up">
        <div id="logo"></div>
      </div>
    </div>
  );
}

export default NewGame;
