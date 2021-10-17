import { IFactoryComponent } from '../../engine/types';
import { ISystemManager } from "../../engine/interfaces/ISystemManager";
import * as React from 'react';
import './styles/Dev.style.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';

import { pp } from '../../engine/utils';
import { withBlur } from '../utils';
import { withEntityModel } from '../Hoc/withEntityModel';
import { FPS } from './FPS';
import { Screens } from '../Screens';

interface Props {
  system:   ISystemManager;
  onStart:  () => void;
  onStop:   () => void;
  onTick:   () => void;
  onSave:   () => void;
  onLoad:   () => void;
  nav:      (screen: Screens) => void;
}

const EntityInspector = withEntityModel(props =>
  <pre>{pp(props.model)}</pre>
);

export const DevScreen = (props: Props) => {
  const [entityId, setEntityId] = useState(0);

  const [open, setOpen]         = useState(false);
  const [dragging, setDrag]     = useState(false);

  const setDragFalse = () => setDrag(false);
  const setDragTrue  = () => setDrag(true);
  const toggleOpen   = () => setOpen(!open);

  const handleClick = () => {
    dragging ? open : toggleOpen();
    setDragFalse();
  }

  return (
    <Draggable>
      <div id="devscreen" className={'container'}>

        <div id="header">
          <span className="float-left title" onMouseUp={handleClick} onMouseDown={setDragFalse} onMouseMove={setDragTrue}>
            <h3>Devtools</h3>
          </span>
          <i id="close-x" className="icon close float-right" onClick={handleClick}></i>
        </div>

        <div className={classNames(!open && 'hidden')}>
          <span className="links">
            <a onClick={() => props.nav('intro')}>Intro</a>{' | '}
            <a onClick={() => props.nav('menu')}>Menu</a>{' | '}
            <a onClick={() => props.nav('game')}>Game</a>
          </span>

          <Buttons {...props} />

          <p>Epoch: {props.system.epoch}</p>

          <FPS />

          <div id="entity-viewer">
            Entities
            <select onChange={e => {
              const value = e.currentTarget.value;
              setEntityId(parseInt(value));
            }}>
              {props.system.getState().entities.map(o => {
                const { name } = props.system.getEntityModel<IFactoryComponent>(o);
                return <option key={o.id} value={o.id}>{name}</option>
              })}
            </select>
            <div className="scrollable p-1">
              <EntityInspector entity={{ id: entityId }} system={props.system} />
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  )
}

function Buttons(props: Props) {
  return (
    <>
      <button className="btn is-primary" onClick={withBlur(props.onStart)}>Start</button>
      <button className="btn is-error" onClick={withBlur(props.onStop)}>Stop</button>
      <button className="btn is-success" onClick={withBlur(props.onTick)}>Evolve</button>
      <button className="btn" onClick={withBlur(props.onSave)}>Save</button>
      <button className="btn is-warning" onClick={withBlur(props.onLoad)}>Load</button>
    </>
  )
}

export function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(o => typeof o === 'string').join(' ');
}
