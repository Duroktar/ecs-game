import * as React from 'react';
import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';
import { pp } from '../../lib/utils';
import { ILevel } from '../Levels/types';
import { humanizedLevelNames } from '../Levels';

interface Props {
  currentLevel: ILevel;
  state:        any;
  onNextLevel:  () => void;
}

export function LevelSummary(props: Props) {
  withEnterKeyEffect(props.onNextLevel);
  return (
    <div className="complete container with-title is-center is-dark fade-in">
      <label className="title">{`Level ${humanizedLevelNames[props.currentLevel]} Complete`}</label>
      <pre>{pp(props.state)}</pre>
      <button className="btn is-primary" onClick={props.onNextLevel}>Press Enter</button>
    </div>
  )
}
