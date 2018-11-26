import * as React from 'react';
import './styles/Dev.style.css';
import Draggable from 'react-draggable';
import { IEntity, ISystemManager } from '../../lib/types';
import { pp } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { FPS } from './FPS';

interface Props {
  system: ISystemManager;
  onStart: () => void;
  onStop: () => void;
  onTick: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export const DevScreen = (props: Props) => (
  <Draggable>
    <div id="devscreen" className="container">

      <Buttons {...props} />

      <span className="links">
        <Link to="/intro">Intro</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/game">Game</Link>
      </span>

      Epoch: {props.system.epoch}

      <FPS />

      <EntityList system={props.system} />

      <pre>{pp(props.system.getState())}</pre>

    </div>
  </Draggable>
)

function entityRenderer(entity: IEntity, system: ISystemManager): JSX.Element {
  return <pre key={entity.id}>{pp(system.getEntityModel(entity))}</pre>;
}
  
function EntityList(props: EntityListProps): JSX.Element {
  const { system } = props;
  return (<>
    {system.system.entities.map((o: any) => entityRenderer(o, system))}
  </>)
}

type EntityListProps = { system: ISystemManager };

function Buttons(props: Props) {
  return (
    <>
      <button onClick={props.onStart}>Start</button>
      <button onClick={props.onStop}>Stop</button>
      <button onClick={props.onTick}>Evolve</button>
      <button onClick={props.onSave}>Save</button>
      <button onClick={props.onLoad}>Load</button>
    </>
  )
}