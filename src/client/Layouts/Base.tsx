import * as React from 'react';
import "./styles/Layout.style.css";

interface Props {
  id?:           string;
  className?:    string;
  topLeft?:      React.ReactNode;
  topCenter?:    React.ReactNode;
  topRight?:     React.ReactNode;
  middleLeft?:   React.ReactNode;
  middleCenter?: React.ReactNode;
  middleRight?:  React.ReactNode;
  bottomLeft?:   React.ReactNode;
  bottomCenter?: React.ReactNode;
  bottomRight?:  React.ReactNode;
  background?:   React.ReactNode;
  children:      React.ReactNode;
}

export function Layout(props: Props) {
  return (
    <div id={props.id} className={`layout ${props.className}`}>
      <div className="top left">{props.topLeft}</div>
      <div className="top center">{props.topCenter}</div>
      <div className="top right">{props.topRight}</div>
      <div className="middle left">{props.middleLeft}</div>
      <div className="middle center">{props.middleCenter}</div>
      <div className="middle right">{props.middleRight}</div>
      <div className="bottom left">{props.bottomLeft}</div>
      <div className="bottom center">{props.bottomCenter}</div>
      <div className="bottom right">{props.bottomRight}</div>
      <div className="background">{props.background}</div>
      <div className="gamescreen">{props.children}</div>
    </div>
  )
}
  