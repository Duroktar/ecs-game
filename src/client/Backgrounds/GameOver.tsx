import * as React from 'react';
import './styles/StarField.style.css';
import './styles/GameOver.style.css';

export function GameOver() {
  return (
    <div id="starfield" className="background">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="gameover-container" className="slide-up">
        <div id="gameover"></div>
      </div>
    </div>
  );
}

export default GameOver;
