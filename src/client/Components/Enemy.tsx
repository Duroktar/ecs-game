import * as React from 'react';

import ShipSprite from '../../assets/enemy.png';
import { MobModel } from '../../game/Domain/mob';
import { withEntity } from '../Hoc/withEntity';
import { WithId, IEntity } from '../../lib/types';

interface Props {
  model: WithId<MobModel>;
  onDeath: (entity: IEntity) => void;
}

export class Enemy extends React.Component<Props> {

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.model.health > 0 && nextProps.model.health === 0) {
      this.props.onDeath(this.props.model);
    }
  }

  render() {
    const isDead = this.props.model.health === 0;
    const styles: React.CSSProperties = {
      position:           'absolute',
      backgroundImage:    `url(${ShipSprite})`,
      backgroundSize:     'contain',
      backgroundPosition: 'center',
      width:              '64px',
      height:             '64px',
      left:               isDead ? -9999 : this.props.model.position.x,
      top:                isDead ? -9999 : this.props.model.position.y,
      display:            cssDisplayValue(this.props.model),
    }
  
    return (
      <div id="enemy" className="sprite" style={styles} />
    )
  }
}

export const ConnectedEnemy = withEntity<MobModel>(Enemy as any)

function cssDisplayValue(model: MobModel) {
  return (model.health === 0) ? 'none' : ''
}
