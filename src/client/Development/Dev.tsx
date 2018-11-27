import * as React from 'react';
import './styles/Dev.style.css';
import Draggable from 'react-draggable';
import { IEntity, ISystemManager } from '../../lib/types';
import { pp } from '../../lib/utils';
import { withBlur } from '../utils';
import { Link } from 'react-router-dom';
import { FPS } from './FPS';
import { withEntity } from '../Hoc/withEntity';

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

      {/* <EntityList system={props.system} /> */}

      {/* <pre>{pp(props.system.getState())}</pre> */}

      <EntityInspector entity={{ id: 0 }} system={props.system} />

    </div>
  </Draggable>
)

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
