import * as React from 'react';
import { ProjectileModel } from '../../game/Domain/projectile';

interface Props {
  model: ProjectileModel;
}

export function Bullet(props: Props) {
  const styles = getStyles(props);
  return (
    <div id="bullet" className="sprite" style={styles} />
  )
}

function getStyles(props: Props): React.CSSProperties {
  return {
    position:     'absolute',
    border:       'solid white 2px',
    borderRadius: '25%',
    height:       '32px',
    width:        '0px', 
    left:         props.model.position.x + 30,
    top:          props.model.position.y,
    display:      cssDisplayValue(props.model),
  }
}

function cssDisplayValue(model: ProjectileModel) {
  return (model.health === 0) ? 'none' : ''
}
