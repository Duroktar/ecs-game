import * as React from 'react';

import { Gui } from '../Layouts/Gui';
import StarField from '../Backgrounds/StarField';

function Screen(props: any) {
  return <div className="screen menu"></div>
}

interface Props {
}

export class Menu extends React.Component<Props> {
  state = {}
  render() {
    return (
      <Gui
        id="gui"
        className="menu"
        score={0}
        credits={0}
        lives={0}
        background={<StarField />}
      >
        <Screen id={0} />
      </Gui>
    )
  }
}
