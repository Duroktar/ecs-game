import { IEntity, ISystemManager } from '../../lib/types';
import * as React from 'react';
import './styles/Dev.style.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';

import { pp } from '../../lib/utils';
import { withBlur } from '../utils';
import { withEntity } from '../Hoc/withEntity';
import { FPS } from './FPS';

interface Props {
  system:   ISystemManager;
  onStart:  () => void;
  onStop:   () => void;
  onTick:   () => void;
  onSave:   () => void;
  onLoad:   () => void;
}

const EntityInspector = withEntity(props =>
  <pre>{pp(props.model)}</pre>
);

export const DevScreen = (props: Props) => {
  const [entityId, setEntityId] = useState(0);
  return (
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

        <select onChange={e => {
          const value = e.currentTarget.value;
          setEntityId(parseInt(value));
        }}>
          {props.system.getState().entities.map(o => {
            return <option key={o.id} value={o.id}>{o.id}</option>
          })}
        </select>

        <EntityInspector entity={{ id: entityId }} system={props.system} />

      </div>
    </Draggable>
  )
}

function Buttons(props: Props) {
  return (
    <>
      <button onClick={withBlur(props.onStart)}>Start</button>
      <button onClick={withBlur(props.onStop)}>Stop</button>
      <button onClick={withBlur(props.onTick)}>Evolve</button>
      <button onClick={withBlur(props.onSave)}>Save</button>
      <button onClick={withBlur(props.onLoad)}>Load</button>
    </>
  )
}

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
