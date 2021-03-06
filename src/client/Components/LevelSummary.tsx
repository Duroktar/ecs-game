import { ICurrentGameState } from '../../game/types';
import { ILevel } from '../Levels/types';
import * as React from 'react';

import { withEnterKeyEffect } from '../hooks/withEnterKeyEffect';

import { humanizedLevelNames } from '../Levels';
import { once } from '../../engine/utils';

interface Props {
  currentLevel: ILevel;
  state:        ICurrentGameState;
  onNextLevel:  () => void;
}

export function LevelSummary(props: Props) {
  withEnterKeyEffect(once(props.onNextLevel));
  return (
    <div className="complete container with-title is-center is-dark fade-in">
      <label className="title">{`Level ${humanizedLevelNames[props.currentLevel]} Complete`}</label>

      <p>{`Score:  ${props.state.score}`}</p>
      <p>{`Shots:  ${props.state.shots}`}</p>
      <p>{`Hits:   ${props.state.hits}`}</p>
      <p>{`Ratio:  ${Math.round(props.state.hits / props.state.shots * 100)}%`}</p>

      <button className="btn is-primary" onClick={props.onNextLevel}>Press Enter</button>
    </div>
  )
}
