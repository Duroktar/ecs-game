import * as React from 'react';

import StarField from '../Backgrounds/StarField';
import { Gui } from '../Layouts/Gui';
import { Loader } from '../Levels/Loader';
import { ISystemManager } from '../../lib/types';
import { CharacterModel } from '../../game/Domain/character';
import { ProjectileModel } from '../../game/Domain/projectile';

interface Props {
  system:  ISystemManager;
  player:  CharacterModel;
  bullet1: ProjectileModel;
  bullet2: ProjectileModel;
}

export function Game(props: Props) {
  return (
    <Gui
      id="game"
      score={0}
      credits={0}
      lives={0}
      background={<StarField />}
    >
      <Loader
        current={'level1'}
        state={props}
        system={props.system}
      />
    </Gui>
  )
}
