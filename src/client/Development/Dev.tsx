import { IEntity, ISystemManager, IEntityModel, IFactoryComponent } from '../../lib/types';
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
  const [open, setOpen] = useState(true);
  const [entityId, setEntityId] = useState(0);

  return (
    <Draggable>
      <div id="devscreen" className={'container'}>

        <div id="header">
          <span className="float-left"><h3>Devtools</h3></span>
          <i id="close-x" className="icon close float-right" onClick={() => setOpen(!open)}></i>
        </div>

        <div className={classNames(!open && 'hidden')}>
          <span className="links">
            <Link to="/intro">Intro</Link>{' | '}
            <Link to="/menu">Menu</Link>{' | '}
            <Link to="/game">Game</Link>
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

export function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(o => typeof o === 'string').join(' ');
}
